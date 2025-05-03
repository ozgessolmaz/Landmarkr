package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank
    private String ad;

    @NotBlank
    private String soyad;

    @Email
    @NotBlank
    private String email;

    @Size(min = 8, message = "Şifre en az 8 karakter olmalıdır.")
    @NotBlank
    private String password;
}
