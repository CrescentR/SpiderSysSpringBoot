package com.multiSpider.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.multiSpider.dto.login.ResultSearchInfo;
import com.multiSpider.entity.SpiderResult;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author CharlesForbit
* @description 针对表【spider_result】的数据库操作Service
* @createDate 2025-10-20 15:06:34
*/
public interface SpiderResultService extends IService<SpiderResult> {
    Page<SpiderResult> listSearchResult(ResultSearchInfo resultSearchInfo);
}
