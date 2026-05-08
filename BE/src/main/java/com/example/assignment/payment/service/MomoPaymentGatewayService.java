package com.example.assignment.payment.service;

import com.example.assignment.payment.config.MomoPaymentProperties;
import com.example.assignment.payment.entity.Payment;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MomoPaymentGatewayService {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private final MomoPaymentProperties momoPaymentProperties;

    public String createPayUrl(Payment payment) {
        validateConfig();

        String amount = payment.getAmount().setScale(0).toPlainString();
        String orderId = payment.getTransactionRef();
        String requestId = payment.getTransactionRef() + "-" + Instant.now().toEpochMilli();
        String orderInfo = "Thanh toan don hang " + payment.getOrder().getOrderCode();
        String extraData = "";

        String rawSignature = String.join("&",
                "accessKey=" + momoPaymentProperties.getAccessKey(),
                "amount=" + amount,
                "extraData=" + extraData,
                "ipnUrl=" + momoPaymentProperties.getIpnUrl(),
                "orderId=" + orderId,
                "orderInfo=" + orderInfo,
                "partnerCode=" + momoPaymentProperties.getPartnerCode(),
                "redirectUrl=" + momoPaymentProperties.getReturnUrl(),
                "requestId=" + requestId,
                "requestType=" + momoPaymentProperties.getRequestType()
        );

        String signature = sign(rawSignature, momoPaymentProperties.getSecretKey());

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("partnerCode", momoPaymentProperties.getPartnerCode());
        payload.put("accessKey", momoPaymentProperties.getAccessKey());
        payload.put("requestId", requestId);
        payload.put("amount", amount);
        payload.put("orderId", orderId);
        payload.put("orderInfo", orderInfo);
        payload.put("redirectUrl", momoPaymentProperties.getReturnUrl());
        payload.put("ipnUrl", momoPaymentProperties.getIpnUrl());
        payload.put("lang", momoPaymentProperties.getLang());
        payload.put("extraData", extraData);
        payload.put("requestType", momoPaymentProperties.getRequestType());
        payload.put("signature", signature);

        try {
            String requestBody = OBJECT_MAPPER.writeValueAsString(payload);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(momoPaymentProperties.getEndpoint()))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "MoMo sandbox returned HTTP " + response.statusCode());
            }

            JsonNode body = OBJECT_MAPPER.readTree(response.body());
            String payUrl = body.path("payUrl").asText(null);
            if (payUrl == null || payUrl.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "MoMo sandbox did not return a payUrl");
            }
            return payUrl;
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Unable to create MoMo payment request", exception);
        }
    }

    private void validateConfig() {
        if (momoPaymentProperties.getPartnerCode() == null || momoPaymentProperties.getPartnerCode().isBlank()
                || momoPaymentProperties.getAccessKey() == null || momoPaymentProperties.getAccessKey().isBlank()
                || momoPaymentProperties.getSecretKey() == null || momoPaymentProperties.getSecretKey().isBlank()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "MoMo credentials are not configured. Set app.payment.momo.partner-code/access-key/secret-key.");
        }
    }

    private String sign(String rawSignature, String secretKey) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] digest = mac.doFinal(rawSignature.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to sign MoMo request", exception);
        }
    }
}