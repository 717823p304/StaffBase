package com.staffbase.dto;

import com.staffbase.models.Employee;

public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private UserDetailsDto user;

    public LoginResponse() {}

    public LoginResponse(String accessToken, String refreshToken, UserDetailsDto user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public UserDetailsDto getUser() { return user; }
    public void setUser(UserDetailsDto user) { this.user = user; }

    public static class UserDetailsDto {
        private String email;
        private String role;
        private Employee profile; // Employee profile details, if any (null for Admin/others without profile)

        public UserDetailsDto() {}

        public UserDetailsDto(String email, String role, Employee profile) {
            this.email = email;
            this.role = role;
            this.profile = profile;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public Employee getProfile() { return profile; }
        public void setProfile(Employee profile) { this.profile = profile; }
    }
}
