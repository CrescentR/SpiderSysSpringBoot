package com.multiSpider.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.multiSpider.entity.SpiderTask;
import com.multiSpider.mapper.SpiderTaskMapper;
import com.multiSpider.service.SummaryDataService;
import com.multiSpider.vo.SummaryDataVO;

public class SummaryDataServiceImpl implements SummaryDataService {
    private final SpiderTaskMapper spiderTaskMapper;
    public SummaryDataServiceImpl(SpiderTaskMapper spiderTaskMapper) {
        this.spiderTaskMapper = spiderTaskMapper;
    }
    @Override
    public SummaryDataVO getSummaryData() {
        SummaryDataVO summaryDataVO = new SummaryDataVO();
        QueryWrapper<SpiderTask> queryWrapper = new QueryWrapper<>();
        Long countTask = spiderTaskMapper.selectCount(queryWrapper);
        summaryDataVO.setCountTask(countTask);
        return summaryDataVO;
    }
}
