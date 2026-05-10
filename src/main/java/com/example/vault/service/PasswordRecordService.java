package com.example.vault.service;

import com.example.vault.dto.PasswordRecordRequest;
import com.example.vault.dto.PasswordRecordResponse;
import com.example.vault.entity.PasswordRecord;
import com.example.vault.entity.User;
import com.example.vault.exception.BadRequestException;
import com.example.vault.exception.ResourceNotFoundException;
import com.example.vault.repository.PasswordRecordRepository;
import com.example.vault.repository.UserRepository;
import com.example.vault.util.AesUtil;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class PasswordRecordService {

    private final PasswordRecordRepository passwordRecordRepository;
    private final UserRepository userRepository;
    private final AesUtil aesUtil;

    public PasswordRecordService(
            PasswordRecordRepository passwordRecordRepository,
            UserRepository userRepository,
            AesUtil aesUtil
    ) {
        this.passwordRecordRepository = passwordRecordRepository;
        this.userRepository = userRepository;
        this.aesUtil = aesUtil;
    }

    public PasswordRecordResponse createRecord(PasswordRecordRequest request) {
        User currentUser = getCurrentUser();

        PasswordRecord record = new PasswordRecord();
        record.setName(request.getName().trim());
        record.setUsername(request.getUsername().trim());
        record.setEncryptedPassword(aesUtil.encrypt(request.getPassword()));
        record.setUser(currentUser);

        return toResponse(passwordRecordRepository.save(record));
    }

    public List<PasswordRecordResponse> getAllRecords() {
        User currentUser = getCurrentUser();
        return passwordRecordRepository.findByUser(currentUser)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PasswordRecordResponse getRecordById(Long id) {
        return toResponse(getOwnedRecord(id));
    }

    public PasswordRecordResponse updateRecord(Long id, PasswordRecordRequest request) {
        PasswordRecord record = getOwnedRecord(id);
        record.setName(request.getName().trim());
        record.setUsername(request.getUsername().trim());
        record.setEncryptedPassword(aesUtil.encrypt(request.getPassword()));

        return toResponse(passwordRecordRepository.save(record));
    }

    public void deleteRecord(Long id) {
        PasswordRecord record = getOwnedRecord(id);
        passwordRecordRepository.delete(record);
    }

    public List<PasswordRecordResponse> searchByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new BadRequestException("Search name is required");
        }

        User currentUser = getCurrentUser();
        return passwordRecordRepository.findByUserAndNameContainingIgnoreCase(currentUser, name.trim())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private PasswordRecord getOwnedRecord(Long id) {
        User currentUser = getCurrentUser();
        return passwordRecordRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Password record not found"));
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }

    private PasswordRecordResponse toResponse(PasswordRecord record) {
        return new PasswordRecordResponse(
                record.getId(),
                record.getName(),
                record.getUsername(),
                aesUtil.decrypt(record.getEncryptedPassword())
        );
    }
}
