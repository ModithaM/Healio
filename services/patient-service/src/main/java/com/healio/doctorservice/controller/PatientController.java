package com.healio.doctorservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/patient-service/")
@RequiredArgsConstructor
public class PatientController {
//    private final AdvertService advertService;
//    private final ModelMapper modelMapper;
//
//    @PostMapping("/create")
//    public ResponseEntity<AdvertDto> createAdvert(@Valid @RequestPart AdvertCreateRequest request,
//                                                  @RequestPart(required = false) MultipartFile file) {
//        return ResponseEntity.status(HttpStatus.CREATED)
//                .body(modelMapper.map(advertService.createAdvert(request, file), AdvertDto.class));
//    }
//
//    @GetMapping("/getAll")
//    public ResponseEntity<List<AdvertDto>> getAll() {
//        return ResponseEntity.ok(advertService.getAll().stream()
//                .map(advert -> modelMapper.map(advert, AdvertDto.class)).toList());
//    }
//
//    @GetMapping("/getAdvertById/{id}")
//    public ResponseEntity<AdvertDto> getAdvertById(@PathVariable String id) {
//        return ResponseEntity.ok(modelMapper.map(advertService.getAdvertById(id), AdvertDto.class));
//    }
//
//    @GetMapping("/getAdvertsByUserId/{id}")
//    public ResponseEntity<List<AdvertDto>> getAdvertsByUserId(@PathVariable String id,
//                                                              @RequestParam Advertiser type) {
//        return ResponseEntity.ok(advertService.getAdvertsByUserId(id, type).stream()
//                .map(advert -> modelMapper.map(advert, AdvertDto.class)).toList());
//    }
//
//    @PutMapping("/update")
//    @PreAuthorize("hasRole('ADMIN') or @advertService.authorizeCheck(#request.id, principal)")
//    public ResponseEntity<AdvertDto> updateAdvertById(@Valid @RequestPart AdvertUpdateRequest request,
//                                                      @RequestPart(required = false) MultipartFile file) {
//        return ResponseEntity.ok(modelMapper.map(advertService.updateAdvertById(request, file), AdvertDto.class));
//    }
//
//    @DeleteMapping("/deleteAdvertById/{id}")
//    @PreAuthorize("hasRole('ADMIN') or @advertService.authorizeCheck(#id, principal)")
//    public ResponseEntity<Void> deleteAdvertById(@PathVariable String id) {
//        advertService.deleteAdvertById(id);
//        return ResponseEntity.ok().build();
//    }
}
