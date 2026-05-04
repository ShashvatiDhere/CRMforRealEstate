package com.realestatecrm.service;

import com.realestatecrm.dto.AgentApprovalRequest;
import com.realestatecrm.dto.CreateAdminRequest;
import com.realestatecrm.dto.CreateManagerRequest;
import com.realestatecrm.entity.Role;
import com.realestatecrm.entity.User;
import com.realestatecrm.entity.UserStatus;
import com.realestatecrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    public String createAdmin(CreateAdminRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new RuntimeException("Name is required");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User admin = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .role(Role.ADMIN)
                .status(UserStatus.ACTIVE)
                .manager(null)
                .otp(null)
                .otpExpiry(null)
                .otpVerified(false)
                .build();

        userRepository.save(admin);
        return "Admin created successfully";
    }

    public String createManager(CreateManagerRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new RuntimeException("Name is required");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User manager = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .role(Role.MANAGER)
                .status(UserStatus.ACTIVE)
                .manager(null)
                .otp(null)
                .otpExpiry(null)
                .otpVerified(false)
                .build();

        userRepository.save(manager);
        return "Manager created successfully";
    }

    public List<User> getPendingAgents() {
        return userRepository.findByRoleAndStatus(Role.AGENT, UserStatus.PENDING);
    }

    public List<User> getAllManagers() {
        return userRepository.findByRole(Role.MANAGER);
    }

    public List<User> getAllAgents() {
        return userRepository.findByRole(Role.AGENT);
    }

    public String approveOrRejectAgent(Long agentId, AgentApprovalRequest request) {
        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        if (agent.getRole() != Role.AGENT) {
            throw new RuntimeException("Selected user is not an agent");
        }

        if (!request.isApproved()) {
            agent.setStatus(UserStatus.REJECTED);
            agent.setManager(null);
            userRepository.save(agent);
            return "Agent rejected successfully";
        }

        if (request.getManagerId() == null) {
            throw new RuntimeException("managerId is required for approval");
        }

        User manager = userRepository.findById(request.getManagerId())
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        if (manager.getRole() != Role.MANAGER) {
            throw new RuntimeException("Assigned user is not a manager");
        }

        agent.setStatus(UserStatus.ACTIVE);
        agent.setManager(manager);
        userRepository.save(agent);

        return "Agent approved and manager assigned successfully";
    }
}
