"use strict";
/**
 * 共享类型定义
 * 前后端通用的数据结构
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceType = exports.QuestionType = exports.SlideType = exports.MetricsCategory = exports.SpeakerRole = exports.SessionStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["TEACHER"] = "teacher";
    UserRole["ADMIN"] = "admin";
    UserRole["SCHOOL_ADMIN"] = "school_admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["RECORDING"] = "recording";
    SessionStatus["PROCESSING"] = "processing";
    SessionStatus["COMPLETED"] = "completed";
    SessionStatus["FAILED"] = "failed";
})(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
var SpeakerRole;
(function (SpeakerRole) {
    SpeakerRole["TEACHER"] = "teacher";
    SpeakerRole["STUDENT"] = "student";
    SpeakerRole["UNKNOWN"] = "unknown";
})(SpeakerRole || (exports.SpeakerRole = SpeakerRole = {}));
var MetricsCategory;
(function (MetricsCategory) {
    MetricsCategory["PRE_CLASS"] = "pre_class";
    MetricsCategory["IN_CLASS"] = "in_class";
    MetricsCategory["POST_CLASS"] = "post_class";
})(MetricsCategory || (exports.MetricsCategory = MetricsCategory = {}));
var SlideType;
(function (SlideType) {
    SlideType["TITLE"] = "title";
    SlideType["SITUATION"] = "situation";
    SlideType["CONTENT"] = "content";
    SlideType["EXERCISE"] = "exercise";
    SlideType["SUMMARY"] = "summary";
})(SlideType || (exports.SlideType = SlideType = {}));
var QuestionType;
(function (QuestionType) {
    QuestionType["MULTIPLE_CHOICE"] = "multiple_choice";
    QuestionType["TRUE_FALSE"] = "true_false";
    QuestionType["SHORT_ANSWER"] = "short_answer";
    QuestionType["ESSAY"] = "essay";
    QuestionType["PRACTICE"] = "practice";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
var ComplianceType;
(function (ComplianceType) {
    ComplianceType["DATA_ENCRYPTION"] = "data_encryption";
    ComplianceType["ACCESS_CONTROL"] = "access_control";
    ComplianceType["DATA_RETENTION"] = "data_retention";
    ComplianceType["PRIVACY_PROTECTION"] = "privacy_protection";
})(ComplianceType || (exports.ComplianceType = ComplianceType = {}));
