package com.multiSpider.entity;

import lombok.Data;

import java.util.List;

@Data
public class StartTask {
    private Integer taskId;
    private List<String> keywords;
}
