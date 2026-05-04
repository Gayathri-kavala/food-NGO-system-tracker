package com.detector.scamdetectorapi.controllers;

import com.detector.scamdetectorapi.dto.AnalyzeRequest;
import com.detector.scamdetectorapi.dto.AnalyzeResponse;
import com.detector.scamdetectorapi.services.AnalyzeService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AnalyzeController {

    private final AnalyzeService analyzeService;

    public AnalyzeController(AnalyzeService analyzeService) {
        this.analyzeService = analyzeService;
    }

    @PostMapping("/analyze")
    public AnalyzeResponse analyze(@RequestBody AnalyzeRequest request) {
        return analyzeService.analyzeText(request.getText());
    }
}
