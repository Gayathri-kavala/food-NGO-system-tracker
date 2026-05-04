package com.detector.scamdetectorapi.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class AnalyzeResponse {
    private double probability;
    private String verdict;
    private List<String> red_flags;
    private String explanation;
    private String advice;
}
