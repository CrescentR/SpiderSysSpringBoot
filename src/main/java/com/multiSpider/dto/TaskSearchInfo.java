package com.multiSpider.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskSearchInfo {
    private Long currentPage = 1L; // 默认值为 1
    private Long pageSize = 10L;   // 默认值为 10
    private String searchKeywords;
    private String status;
    private String startTime;
    private String endTime;
}
