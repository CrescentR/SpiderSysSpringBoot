package com.multiSpider.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.multiSpider.entity.ResultSearchInfo;
import com.multiSpider.entity.SpiderResult;
import com.baomidou.mybatisplus.extension.service.IService;
import com.multiSpider.entity.SpiderTask;
import com.multiSpider.entity.TaskSearchInfo;

/**
* @author CharlesForbit
* @description 针对表【spider_result】的数据库操作Service
* @createDate 2025-10-20 15:06:34
*/
public interface SpiderResultService extends IService<SpiderResult> {
    Page<SpiderResult> listSearchResult(ResultSearchInfo resultSearchInfo);
}
