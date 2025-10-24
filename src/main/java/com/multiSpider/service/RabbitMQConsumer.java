package com.multiSpider.service;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import com.multiSpider.entity.SpiderResult;
import com.multiSpider.vo.queue.*;
import com.multiSpider.vo.queue.SpiderDataVO;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Component
public class RabbitMQConsumer {
    private final SpiderResultService spiderResultService;
    private final ObjectMapper mapper = new ObjectMapper();

    public RabbitMQConsumer(SpiderResultService spiderResultService) {
        this.spiderResultService = spiderResultService;
    }

    @RabbitListener(queues = "crawler.data.springBoot")
    @Transactional
    public void receiveFromSpringBootData(String message) {
        System.out.println("接收消息: " + message);
        try {
            JsonNode root = mapper.readTree(message);
            String type = root.path("messageType").asText("");
            switch (type) {
                case "result": {
                    // 先试批量
                    try {
                        Envelope<ResultListPayload> bulk = mapper.readValue(
                                message, new TypeReference<>() {});
                        if (bulk.getPayload() != null && bulk.getPayload().getItems() != null) {
                            persistResults(bulk.getPayload().getItems());
                            break;
                        }
                    } catch (Exception ignore) { /* 回退到单条 */ }

                    // 单条
                    Envelope<SpiderDataVO> single = mapper.readValue(
                            message, new TypeReference<>() {});
                    persistResults(java.util.List.of(single.getPayload()));
                    break;
                }
                case "progress": {
                    Envelope<ProgressPayload> progress = mapper.readValue(
                            message, new TypeReference<>() {});
                    System.out.printf("进度：%d/%d%n",
                            progress.getPayload().getCurrentPage(),
                            progress.getPayload().getTotalPages());
                    break;
                }
                case "status": {
                    Envelope<StatusPayload> status = mapper.readValue(
                            message, new TypeReference<>() {});
                    System.out.printf("状态：%s err=%s%n",
                            status.getPayload().getStatus(),
                            status.getPayload().getError());
                    break;
                }
                default:
                    System.out.println("未知类型：" + type);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void persistResults(java.util.List<SpiderDataVO> items) {
        // 映射到你的实体 SpiderResult 并批量保存
        List<SpiderResult> list = new ArrayList<>();
        for (SpiderDataVO vo : items) {
            if (vo.getUrl() == null || vo.getUrl().isEmpty()) continue;
            SpiderResult spiderResult = new SpiderResult();
            spiderResult.setUrl(vo.getUrl());
            spiderResult.setTitle(vo.getTitle());
            spiderResult.setSource(vo.getSource());
            spiderResult.setKeywords(vo.getKeywords() == null ? null : String.join(",", vo.getKeywords()));
            spiderResult.setDateTime(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
            list.add(spiderResult);
        }
        if (!list.isEmpty()) {
            spiderResultService.saveBatch(list);
            System.out.println("保存结果条数：" + list.size());
        }
    }
}