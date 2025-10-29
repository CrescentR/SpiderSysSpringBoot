package com.multiSpider.vo;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SummaryDataVO {
    private Long countTask;
    private Long countResult;
    private StatusData statusData;
    private DateData dateData;
    public static class StatusData{
        private String status;
        private Long count;
    }
    public static class DateData{
        private String date;
        private Long count;
    }
}
