package com.JobAppBackend.JobApp.controller;

import com.JobAppBackend.JobApp.entity.User;
import com.JobAppBackend.JobApp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(
            @PathVariable String email
    ) {
        return userService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        Optional<User> existingUser =
                userService.findByEmail(user.getEmail());

        if (existingUser.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Invalid email or password");
        }

        User foundUser = existingUser.get();

        if (!foundUser.getPassword().equals(user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body("Invalid email or password");
        }

        return ResponseEntity.ok(foundUser);
    }
}