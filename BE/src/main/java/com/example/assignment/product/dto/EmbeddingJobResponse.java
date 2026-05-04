package com.example.assignment.product.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * Response payload khi kích hoạt job sinh embedding cho sản phẩm.
 */
@Getter
@Builder
public class EmbeddingJobResponse {

    /** Tổng số sản phẩm cần xử lý */
    private final int total;

    /** Số sản phẩm sinh embedding thành công */
    private final int succeeded;

    /** Số sản phẩm thất bại (bỏ qua, không dừng job) */
    private final int failed;

    /** Mô tả tóm tắt kết quả */
    private final String summary;
}
