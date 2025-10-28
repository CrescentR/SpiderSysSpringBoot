package com.multiSpider.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.multiSpider.entity.*;
import com.multiSpider.mapper.SpiderTaskMapper;
import com.multiSpider.service.SpiderResultService;
import com.multiSpider.mapper.SpiderResultMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
* @author CharlesForbit
* @description 针对表【spider_result】的数据库操作Service实现
* @createDate 2025-10-20 15:06:34
*/
@Service
public class SpiderResultServiceImpl extends ServiceImpl<SpiderResultMapper, SpiderResult>
    implements SpiderResultService{
    private final SpiderResultMapper spiderResultMapper;
    public SpiderResultServiceImpl(SpiderResultMapper spiderResultMapper) {
        this.spiderResultMapper = spiderResultMapper;
    }
    @Override
    public Page<SpiderResult> listSearchResult(ResultSearchInfo resultSearchInfo){
        QueryWrapper<SpiderResult> queryWrapper = new QueryWrapper<>();

        // 处理分页信息
        Long currentPage = resultSearchInfo.getCurrentPage() != null ? resultSearchInfo.getCurrentPage() : 1L;
        Long pageSize = resultSearchInfo.getPageSize() != null ? resultSearchInfo.getPageSize() : 10L;

        String searchKeywords = resultSearchInfo.getSearchKeywords();
        String startTime = resultSearchInfo.getStartTime();
        String endTime = resultSearchInfo.getEndTime();

        if (StringUtils.hasText(searchKeywords)) {
            queryWrapper.and(q -> q
                    .like("title", searchKeywords)
                    .or().like("source", searchKeywords)
                    .or().like("keywords", searchKeywords)
            );
        }

        // 处理时间范围
        if (StringUtils.hasText(startTime) && StringUtils.hasText(endTime)) {
            // 转换日期格式
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            LocalDateTime start = LocalDateTime.parse(startTime, formatter);
            LocalDateTime end = LocalDateTime.parse(endTime, formatter);

            queryWrapper.and(q -> q
                    .ge("date_time", start)
                    .le("date_time", end)
            );
        } else if (StringUtils.hasText(startTime)) {
            // 单一开始时间
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            LocalDateTime start = LocalDateTime.parse(startTime, formatter);

            queryWrapper.and(q -> q
                    .ge("date_time", start)
            );
        }

        // 创建分页对象
        Page<SpiderResult> page = new Page<>(currentPage, pageSize);
        return page(page, queryWrapper);
    }
}




