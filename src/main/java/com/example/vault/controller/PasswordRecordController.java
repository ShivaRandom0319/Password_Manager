package com.example.vault.controller;

import com.example.vault.dto.ApiResponse;
import com.example.vault.dto.PasswordRecordRequest;
import com.example.vault.dto.PasswordRecordResponse;
import com.example.vault.service.PasswordRecordService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/passwords")
public class PasswordRecordController {

    private final PasswordRecordService passwordRecordService;

    public PasswordRecordController(PasswordRecordService passwordRecordService) {
        this.passwordRecordService = passwordRecordService;
    }

    @PostMapping
    public ResponseEntity<PasswordRecordResponse> createRecord(
            @Valid @RequestBody PasswordRecordRequest request
    ) {
        return ResponseEntity.ok(passwordRecordService.createRecord(request));
    }

    @GetMapping
    public ResponseEntity<List<PasswordRecordResponse>> getAllRecords() {
        return ResponseEntity.ok(passwordRecordService.getAllRecords());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PasswordRecordResponse> getRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(passwordRecordService.getRecordById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PasswordRecordResponse> updateRecord(
            @PathVariable Long id,
            @Valid @RequestBody PasswordRecordRequest request
    ) {
        return ResponseEntity.ok(passwordRecordService.updateRecord(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteRecord(@PathVariable Long id) {
        passwordRecordService.deleteRecord(id);
        return ResponseEntity.ok(new ApiResponse("Password record deleted successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PasswordRecordResponse>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(passwordRecordService.searchByName(name));
    }
}
