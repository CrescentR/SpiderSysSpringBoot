package com.multiSpider.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/SummaryData")
public class SummaryDataController {
    @RequestMapping("/")
    public String summaryData() {
        return "This is the summary data.";
    }
}
