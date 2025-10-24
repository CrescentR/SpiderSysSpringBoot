package com.multiSpider.vo.queue;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Envelope<T> {
    private String version;

    private String messageType;

    @JsonAlias({"task_id"})
    private long taskId;

    private long timestamp;

    @JsonAlias({"datetime"})
    private String dateTime;

    private T payload;
}
