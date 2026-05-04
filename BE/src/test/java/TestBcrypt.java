import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestBcrypt {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode("123456");
        System.out.println("NEW HASH: " + hash);
        boolean matches = encoder.matches("123456", "$2a$10$X/wGyeT6g9aYqBwP2H5oH.P0E1m5R8zP5T8F.K2n.e/1n/7x0qX5q");
        System.out.println("OLD HASH MATCHES: " + matches);
    }
}
