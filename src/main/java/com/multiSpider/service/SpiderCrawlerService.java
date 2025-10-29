package com.multiSpider.service;

import com.multiSpider.vo.queue.MQReturn;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class SpiderCrawlerService {
    private final WebClient webClient=WebClient.create();
    private final SpiderTaskService spiderTaskService;
    public SpiderCrawlerService(SpiderTaskService spiderTaskService) {
        this.spiderTaskService = spiderTaskService;
    }
    public MQReturn callApi(Integer taskId) {

        Map<String, Object> body = Map.of("taskId", taskId, "keywords", spiderTaskService.getKeywords(taskId),"pageSize",spiderTaskService.getTaskPageSize(taskId));
        MQReturn result = webClient.post()
                .uri("http://localhost:8000/api/crawl/start")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(MQReturn.class)
                .block();
        spiderTaskService.update().set("status","已完成").eq("id",taskId).update();
        return result;
    }
}
