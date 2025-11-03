package com.multiSpider.controller;

import com.multiSpider.common.result.Result;
import com.multiSpider.service.SummaryDataService;
import com.multiSpider.vo.SummaryDataVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/SummaryData")
public class SummaryDataController {
    private final SummaryDataService summaryDataService;
    public SummaryDataController(SummaryDataService summaryDataService) {
        this.summaryDataService = summaryDataService;
    }
    @GetMapping("/get")
    public Result<SummaryDataVO> summaryData() {
        try {
            SummaryDataVO summaryData = summaryDataService.getSummaryData();
            return Result.ok(summaryData);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.fail(501,"获取统计数据失败: " + e.getMessage());
        }
    }
}
