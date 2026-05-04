package com.detector.scamdetectorapi.services;

import com.detector.scamdetectorapi.dto.AnalyzeResponse;
import org.springframework.stereotype.Service;
import java.util.Arrays;

@Service
public class AnalyzeService {

    private final GeminiService geminiService;

    public AnalyzeService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public AnalyzeResponse analyzeText(String text) {
        if (text == null || text.isEmpty()) {
            return createDefaultResponse();
        }

        double probability = 0.0;
        List<String> redFlags = new ArrayList<>();
        String lowerText = text.toLowerCase();

        // 1. Check for Payment/Fees (High Risk)
        if (lowerText.contains("fee") || lowerText.contains("payment") || lowerText.contains("bank detail")) {
            probability += 40.0;
            redFlags.add("Requests for money or sensitive bank details.");
        }

        // 2. Check for Urgency (Medium Risk)
        if (lowerText.contains("urgent") || lowerText.contains("immediate") || lowerText.contains("hurry")) {
            probability += 20.0;
            redFlags.add("Artificial urgency to pressure you.");
        }

        // 3. Check for Suspicious Communication (Medium Risk)
        if (lowerText.contains("whatsapp") || lowerText.contains("telegram")) {
            probability += 20.0;
            redFlags.add("Uses informal messaging apps for official business.");
        }

        // 4. Check for Personal Emails (Medium Risk)
        if (lowerText.contains("@gmail.com") || lowerText.contains("@outlook.com") || lowerText.contains("@yahoo.com")) {
            probability += 20.0;
            redFlags.add("Uses a personal email address instead of a corporate one.");
        }

        // 5. Call AI for Contextual Analysis
        AnalyzeResponse aiResponse = geminiService.getAIAnalysis(text);

        if (aiResponse != null) {
            // Merge results: If AI identifies flags, add them to our list
            redFlags.addAll(aiResponse.getRed_flags());
            // In a production app, we might weigh AI more heavily (e.g., 70% AI + 30% Keywords)
            probability = (probability + aiResponse.getProbability()) / 2;
        }

        // Cap probability at 95%
        probability = Math.min(probability, 95.0);

        // Determine Verdict
        String verdict = "Safe";
        if (probability > 60) verdict = "Scam";
        else if (probability > 20) verdict = "Suspicious";

        return AnalyzeResponse.builder()
                .probability(probability)
                .verdict(verdict)
                .red_flags(redFlags)
                .explanation("System detected " + redFlags.size() + " common scam patterns.")
                .advice("Do not provide any financial information or pay for equipment upfront.")
                .build();
    }

    private AnalyzeResponse createDefaultResponse() {
        return AnalyzeResponse.builder()
                .probability(0.0)
                .verdict("Safe")
                .red_flags(new ArrayList<>())
                .explanation("No text provided.")
                .advice("Please paste the job description to analyze.")
                .build();
    }
}
