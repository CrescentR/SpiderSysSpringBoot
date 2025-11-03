package com.multiSpider.mapper;

import com.multiSpider.entity.SpiderResult;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.multiSpider.vo.DateData;

import java.util.List;

/**
* @author CharlesForbit
* @description 针对表【spider_result】的数据库操作Mapper
* @createDate 2025-10-20 15:06:34
* @Entity com.quickStart.entity.SpiderResult
*/
public interface SpiderResultMapper extends BaseMapper<SpiderResult> {
    List<DateData> countDateResult();
}




