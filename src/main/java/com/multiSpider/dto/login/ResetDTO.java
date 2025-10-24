package com.multiSpider.dto.login;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResetDTO {
    private Long id;
    private String currentPassword;
    private String newPassword;
}
