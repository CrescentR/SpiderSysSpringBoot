package com.multiSpider.common.config;


import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.ExchangeBuilder;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Qualifier;

@Configuration
public class RabbitMQConfig {

    // === 对应 Python 的 EXCHANGE_CONFIG ===
    public static final String EXCHANGE_FANOUT = "crawler.fanout.exchange"; // Fanout 交换机名称

    // === 对应 Python 的 QUEUE_CONFIG ===
    public static final String QUEUE_SPRING_BOOT_STATUS = "crawler.status.springBoot"; // SpringBoot 队列
    public static final String QUEUE_SPRING_BOOT_DATA = "crawler.data.springBoot"; // SpringBoot 队列
    public static final String QUEUE_FRONT       = "crawler.data.front";      // 前端队列

    // 声明 Fanout 交换机（durable = true）
    @Bean(EXCHANGE_FANOUT)
    public FanoutExchange fanoutExchange() {
        return ExchangeBuilder
                .fanoutExchange(EXCHANGE_FANOUT)
                .durable(true)   // 持久化
                .build();
    }

    @Bean(QUEUE_SPRING_BOOT_DATA)
    public Queue springBootDataQueue() {
        // new Queue(name, durable, exclusive, autoDelete)
        return new Queue(QUEUE_SPRING_BOOT_DATA, true, false, false);
    }
    // 声明 Front 队列（durable = true, exclusive = false, autoDelete = false）
    @Bean(QUEUE_FRONT)
    public Queue frontQueue() {
        return new Queue(QUEUE_FRONT, true, false, false);
    }

    @Bean
    public Binding bindSpringBootDataQueue(
            @Qualifier(QUEUE_SPRING_BOOT_DATA) Queue queue,
            @Qualifier(EXCHANGE_FANOUT) FanoutExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange);
    }
    @Bean
    public Binding bindFrontQueue(
            @Qualifier(QUEUE_FRONT) Queue queue,
            @Qualifier(EXCHANGE_FANOUT) FanoutExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange);
    }

}