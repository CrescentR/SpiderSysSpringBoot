package com.multiSpider.entity;

import lombok.Data;

import java.util.List;

@Data
public class MQReturn {
    private Integer taskId;
    private String status;
    private List<String> keywords;
    private List<String> consumers;
    private String message;
}
