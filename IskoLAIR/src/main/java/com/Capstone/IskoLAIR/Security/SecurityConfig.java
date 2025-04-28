package com.Capstone.IskoLAIR.Security;

import com.Capstone.IskoLAIR.Repository.AdminRepository;
import com.Capstone.IskoLAIR.Repository.ScholarRepository;
import com.Capstone.IskoLAIR.Repository.StaffRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Autowired private JWTFilter filter;
    @Autowired private AdminDetailsService adminDetailsService;
    @Autowired private OurScholarDetailsService scholarDetailsService;
    @Autowired private StaffDetailsService staffDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // 🔧 inject CORS config
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/ws/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/contacts**").authenticated()
                .requestMatchers("/api/fileresources/**").permitAll()
                .requestMatchers("/api/scholar/reset-password", "/api/scholar/change-password", "/api/scholar/save-password").permitAll()

                // Admin-Only Routes
                .requestMatchers("/api/admin/register-staff").hasAuthority("ROLE_ADMIN")
                .requestMatchers("/api/admin/{id}").hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")
                .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")

                // Admin & Staff can register scholars
                .requestMatchers("/api/admin/register-scholar").hasAnyAuthority("ROLE_ADMIN", "ROLE_STAFF")

                // Contact visibility
                .requestMatchers("/api/staff/visible").hasAnyAuthority("ROLE_SCHOLAR", "ROLE_STAFF", "ROLE_ADMIN")

                // Scholar Routes
                .requestMatchers("/api/scholar/**").hasAuthority("ROLE_SCHOLAR")
                .requestMatchers(HttpMethod.PUT, "/api/scholars/{id}").hasAnyAuthority("ROLE_SCHOLAR", "ROLE_ADMIN", "ROLE_STAFF")
                .requestMatchers("/api/scholars/info").hasAuthority("ROLE_SCHOLAR")

                // Staff Routes
                .requestMatchers("/api/staff/{id}").hasAnyAuthority("ROLE_STAFF", "ROLE_ADMIN")
                .requestMatchers("/api/staff/**").hasAuthority("ROLE_STAFF")

                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) ->
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: Access Denied"))
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider adminAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(adminDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public DaoAuthenticationProvider scholarAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(scholarDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public DaoAuthenticationProvider staffAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(staffDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return new ProviderManager(List.of(
            adminAuthenticationProvider(),
            scholarAuthenticationProvider(),
            staffAuthenticationProvider()
        ));
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "https://system-integration-project.vercel.app"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // Applies to all routes
        return source;
    }
}
