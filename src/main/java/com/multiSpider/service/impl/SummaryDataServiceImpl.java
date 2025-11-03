package com.multiSpider.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.multiSpider.entity.SpiderResult;
import com.multiSpider.entity.SpiderTask;
import com.multiSpider.mapper.SpiderResultMapper;
import com.multiSpider.mapper.SpiderTaskMapper;
import com.multiSpider.service.SummaryDataService;
import com.multiSpider.vo.DateData;
import com.multiSpider.vo.StatusData;
import com.multiSpider.vo.SummaryDataVO;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class SummaryDataServiceImpl implements SummaryDataService {
    private final SpiderTaskMapper spiderTaskMapper;
    private final SpiderResultMapper spiderResultMapper;
    public SummaryDataServiceImpl(SpiderTaskMapper spiderTaskMapper,
                                  SpiderResultMapper spiderResultMapper) {
        this.spiderTaskMapper = spiderTaskMapper;
        this.spiderResultMapper = spiderResultMapper;
    }
    @Override
    public SummaryDataVO getSummaryData() {
        SummaryDataVO summaryDataVO = new SummaryDataVO();
        QueryWrapper<SpiderTask> queryTaskWrapper = new QueryWrapper<>();
        QueryWrapper<SpiderResult> queryResultWrapper = new QueryWrapper<>();
        Long countTask = spiderTaskMapper.selectCount(queryTaskWrapper);
        Long countResult = spiderResultMapper.selectCount(queryResultWrapper);
        List<DateData> dateDataList = spiderResultMapper.countDateResult();
        List<StatusData> statusDataList = spiderTaskMapper.countStatusTask();
        summaryDataVO.setCountTask(countTask);
        summaryDataVO.setCountResult(countResult);
        summaryDataVO.setDateData(dateDataList);
        summaryDataVO.setStatusData(statusDataList);
        return summaryDataVO;
    }
}
