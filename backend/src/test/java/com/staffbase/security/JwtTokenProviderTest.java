package com.staffbase.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;

    private static final String SECRET = "TestSecretKeyThatIsAtLeast64BytesLongForHS512AlgorithmTestingPurposesOnly1234567890";
    private static final long ACCESS_EXPIRY_MS = 900_000; // 15 min
    private static final long REFRESH_EXPIRY_MS = 604_800_000; // 7 days

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider(SECRET, ACCESS_EXPIRY_MS, REFRESH_EXPIRY_MS);
    }

    @Test
    void generateAccessToken_containsEmailAndRole() {
        String token = tokenProvider.generateAccessToken("user@test.com", "Admin");

        assertNotNull(token);
        assertEquals("user@test.com", tokenProvider.getEmailFromToken(token));
        assertEquals("Admin", tokenProvider.getRoleFromToken(token));
    }

    @Test
    void generateRefreshToken_containsEmail() {
        String token = tokenProvider.generateRefreshToken("user@test.com");

        assertNotNull(token);
        assertEquals("user@test.com", tokenProvider.getEmailFromToken(token));
    }

    @Test
    void validateToken_returnsTrueForValidToken() {
        String token = tokenProvider.generateAccessToken("user@test.com", "Employee");
        assertTrue(tokenProvider.validateToken(token));
    }

    @Test
    void validateToken_throwsForExpiredToken() {
        JwtTokenProvider shortLivedProvider = new JwtTokenProvider(SECRET, -1000, -1000);
        String token = shortLivedProvider.generateAccessToken("user@test.com", "Employee");

        assertThrows(ExpiredJwtException.class, () -> tokenProvider.validateToken(token));
    }

    @Test
    void validateToken_throwsForMalformedToken() {
        assertThrows(MalformedJwtException.class, () -> tokenProvider.validateToken("not.a.valid.token"));
    }

    @Test
    void validateToken_throwsForTamperedToken() {
        String token = tokenProvider.generateAccessToken("user@test.com", "Admin");
        String tampered = token.substring(0, token.length() - 4) + "XXXX";

        assertThrows(SignatureException.class, () -> tokenProvider.validateToken(tampered));
    }

    @Test
    void getEmailFromToken_differentUsers() {
        String token1 = tokenProvider.generateAccessToken("alice@test.com", "HR");
        String token2 = tokenProvider.generateAccessToken("bob@test.com", "Employee");

        assertEquals("alice@test.com", tokenProvider.getEmailFromToken(token1));
        assertEquals("bob@test.com", tokenProvider.getEmailFromToken(token2));
    }

    @Test
    void getRoleFromToken_variousRoles() {
        String adminToken = tokenProvider.generateAccessToken("a@test.com", "Admin");
        String hrToken = tokenProvider.generateAccessToken("h@test.com", "HR");
        String empToken = tokenProvider.generateAccessToken("e@test.com", "Employee");

        assertEquals("Admin", tokenProvider.getRoleFromToken(adminToken));
        assertEquals("HR", tokenProvider.getRoleFromToken(hrToken));
        assertEquals("Employee", tokenProvider.getRoleFromToken(empToken));
    }

    @Test
    void accessAndRefreshTokens_areDifferent() {
        String access = tokenProvider.generateAccessToken("user@test.com", "Admin");
        String refresh = tokenProvider.generateRefreshToken("user@test.com");

        assertNotEquals(access, refresh);
    }
}
