package com.staffbase.dto;

import com.staffbase.models.Employee;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DtoTest {

    // --- ApiResponse Tests ---

    @Test
    void apiResponse_twoArgConstructor_setsFieldsCorrectly() {
        ApiResponse<String> response = new ApiResponse<>(true, "Success");

        assertTrue(response.isSuccess());
        assertEquals("Success", response.getMessage());
        assertNull(response.getData());
    }

    @Test
    void apiResponse_threeArgConstructor_setsFieldsCorrectly() {
        ApiResponse<String> response = new ApiResponse<>(false, "Error", "detail");

        assertFalse(response.isSuccess());
        assertEquals("Error", response.getMessage());
        assertEquals("detail", response.getData());
    }

    @Test
    void apiResponse_setters_updateFields() {
        ApiResponse<Integer> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Updated");
        response.setData(42);

        assertTrue(response.isSuccess());
        assertEquals("Updated", response.getMessage());
        assertEquals(42, response.getData());
    }

    // --- LoginRequest Tests ---

    @Test
    void loginRequest_noArgConstructor_fieldsAreNull() {
        LoginRequest req = new LoginRequest();
        assertNull(req.getEmail());
        assertNull(req.getPassword());
    }

    @Test
    void loginRequest_allArgConstructor_setsFields() {
        LoginRequest req = new LoginRequest("test@email.com", "secret");
        assertEquals("test@email.com", req.getEmail());
        assertEquals("secret", req.getPassword());
    }

    @Test
    void loginRequest_setters_updateFields() {
        LoginRequest req = new LoginRequest();
        req.setEmail("new@email.com");
        req.setPassword("newpass");
        assertEquals("new@email.com", req.getEmail());
        assertEquals("newpass", req.getPassword());
    }

    // --- LoginResponse Tests ---

    @Test
    void loginResponse_noArgConstructor_fieldsAreNull() {
        LoginResponse resp = new LoginResponse();
        assertNull(resp.getAccessToken());
        assertNull(resp.getRefreshToken());
        assertNull(resp.getUser());
    }

    @Test
    void loginResponse_allArgConstructor_setsFields() {
        LoginResponse.UserDetailsDto userDto = new LoginResponse.UserDetailsDto("u@test.com", "Admin", null);
        LoginResponse resp = new LoginResponse("access123", "refresh456", userDto);

        assertEquals("access123", resp.getAccessToken());
        assertEquals("refresh456", resp.getRefreshToken());
        assertNotNull(resp.getUser());
        assertEquals("u@test.com", resp.getUser().getEmail());
        assertEquals("Admin", resp.getUser().getRole());
        assertNull(resp.getUser().getProfile());
    }

    @Test
    void loginResponse_setters_updateFields() {
        LoginResponse resp = new LoginResponse();
        resp.setAccessToken("newAccess");
        resp.setRefreshToken("newRefresh");

        LoginResponse.UserDetailsDto dto = new LoginResponse.UserDetailsDto();
        dto.setEmail("x@test.com");
        dto.setRole("HR");
        dto.setProfile(new Employee());
        resp.setUser(dto);

        assertEquals("newAccess", resp.getAccessToken());
        assertEquals("newRefresh", resp.getRefreshToken());
        assertEquals("x@test.com", resp.getUser().getEmail());
        assertEquals("HR", resp.getUser().getRole());
        assertNotNull(resp.getUser().getProfile());
    }

    // --- RefreshRequest Tests ---

    @Test
    void refreshRequest_setterGetter() {
        RefreshRequest req = new RefreshRequest();
        req.setRefreshToken("token123");
        assertEquals("token123", req.getRefreshToken());
    }
}
