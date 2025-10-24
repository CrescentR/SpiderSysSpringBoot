package com.multiSpider.vo.queue;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** payload for messageType = result（单条） */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SpiderDataVO {
    /**
     * 关键词数组；生产端已做兼容，不再使用字符串形式
     */
    private List<String> keywords;

    private String url;

    private String title;

    private String source;

    @JsonAlias({"datetime"})
    private String dateTime;

}
