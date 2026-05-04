package com.detector.scamdetectorapi.services;

import com.detector.scamdetectorapi.dto.AnalyzeResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
        this.objectMapper = new ObjectMapper();
    }

    public AnalyzeResponse getAIAnalysis(String text) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("YOUR_GEMINI_API_KEY_HERE")) {
            return null;
        }

        try {
            String prompt = "You are a fraud detection expert. Analyze the following job description or email and return a JSON object with: " +
                    "scam_probability (a number 0-100), verdict (Safe, Suspicious, or Scam), red_flags (list of strings), explanation, and safety_advice. " +
                    "Return ONLY the raw JSON. " +
                    "Text to analyze: " + text;

            Map<String, Object> body = Map.of(
                "contents", List.of(Map.of(
                    "parts", List.of(Map.of("text", prompt))
                )),
                "generationConfig", Map.of(
                    "response_mime_type", "application/json"
                )
            );

            String response = webClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = objectMapper.readTree(response);
            String aiContent = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            
            return parseAIResponse(aiContent);

        } catch (Exception e) {
            System.err.println("Gemini Error: " + e.getMessage());
            return null;
        }
    }

    private AnalyzeResponse parseAIResponse(String content) {
        try {
            JsonNode node = objectMapper.readTree(content);
            List<String> flags = new ArrayList<>();
            node.path("red_flags").forEach(f -> flags.add(f.asText()));

            return AnalyzeResponse.builder()
                    .probability(node.path("scam_probability").asDouble())
                    .verdict(node.path("verdict").asText())
                    .red_flags(flags)
                    .explanation(node.path("explanation").asText())
                    .advice(node.path("safety_advice").asText())
                    .build();
        } catch (Exception e) {
            return null;
        }
    }
}
