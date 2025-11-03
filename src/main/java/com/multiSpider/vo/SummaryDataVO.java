package com.multiSpider.vo;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SummaryDataVO {
    private Long countTask;
    private Long countResult;
    private List<StatusData> statusData;
    private List<DateData> dateData;
}
