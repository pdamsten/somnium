//**************************************************************************
//
//   Copyright (c) 2018 by Petri Damstén <petri.damsten@gmail.com>
//
//   Adjustment layer handling
//
//**************************************************************************

var mystery_data = String.fromCharCode( 0, 0, 14, 212, 65, 68, 66, 69, 4, 0, 0, 0, 108, 105, 110, 107, 82, 71, 66, 32, 82, 71, 66, 32, 7, 226, 0, 10, 0, 28, 0, 10,
0, 8, 0, 42, 97, 99, 115, 112, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
0, 0, 0, 0, 0, 0, 246, 214, 0, 1, 0, 0, 0, 0, 211, 45, 65, 68, 66, 69, 63, 71, 183, 245, 181, 76, 89, 47, 74, 221, 208, 29,
50, 26, 211, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
0, 0, 0, 4, 100, 101, 115, 99, 0, 0, 0, 180, 0, 0, 0, 60, 99, 112, 114, 116, 0, 0, 0, 240, 0, 0, 0, 110, 112, 115, 101, 113,
0, 0, 1, 96, 0, 0, 0, 116, 65, 50, 66, 48, 0, 0, 1, 212, 0, 0, 13, 0, 109, 108, 117, 99, 0, 0, 0, 0, 0, 0, 0, 1,
0, 0, 0, 12, 101, 110, 85, 83, 0, 0, 0, 32, 0, 0, 0, 28, 0, 67, 0, 114, 0, 105, 0, 115, 0, 112, 0, 95, 0, 87, 0, 97,
0, 114, 0, 109, 0, 46, 0, 108, 0, 111, 0, 111, 0, 107, 0, 0, 109, 108, 117, 99, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 12,
101, 110, 85, 83, 0, 0, 0, 82, 0, 0, 0, 28, 0, 67, 0, 111, 0, 112, 0, 121, 0, 114, 0, 105, 0, 103, 0, 104, 0, 116, 0, 32,
0, 50, 0, 48, 0, 49, 0, 56, 0, 32, 0, 65, 0, 100, 0, 111, 0, 98, 0, 101, 0, 32, 0, 83, 0, 121, 0, 115, 0, 116, 0, 101,
0, 109, 0, 115, 0, 32, 0, 73, 0, 110, 0, 99, 0, 111, 0, 114, 0, 112, 0, 111, 0, 114, 0, 97, 0, 116, 0, 101, 0, 100, 0, 0,
112, 115, 101, 113, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
109, 108, 117, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 109, 108, 117, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12,
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 109, 108, 117, 99, 0, 0, 0, 0, 0, 0, 0, 0,
0, 0, 0, 12, 109, 108, 117, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 109, 65, 66, 32, 0, 0, 0, 0, 3, 3, 0, 0,
0, 0, 0, 32, 0, 0, 0, 68, 0, 0, 0, 116, 0, 0, 6, 152, 0, 0, 6, 220, 99, 117, 114, 118, 0, 0, 0, 0, 0, 0, 0, 0,
99, 117, 114, 118, 0, 0, 0, 0, 0, 0, 0, 0, 99, 117, 114, 118, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 108, 73, 0, 0, 0, 0,
0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 108, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 108, 73, 255, 255, 212, 73,
255, 255, 212, 73, 255, 255, 212, 73, 99, 117, 114, 118, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5,
6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21,
22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31, 32, 32, 33, 33, 34, 34, 35, 35, 36, 36, 37, 37,
38, 38, 39, 39, 40, 40, 41, 41, 42, 42, 43, 43, 44, 44, 45, 45, 46, 46, 47, 47, 48, 48, 49, 49, 50, 50, 51, 51, 52, 52, 53, 53,
54, 54, 55, 55, 56, 56, 57, 57, 58, 58, 59, 59, 60, 60, 61, 61, 62, 62, 63, 63, 64, 64, 65, 65, 66, 66, 67, 67, 68, 68, 69, 69,
70, 70, 71, 71, 72, 72, 73, 73, 74, 74, 75, 75, 76, 76, 77, 77, 78, 78, 79, 79, 80, 80, 81, 81, 82, 82, 83, 83, 84, 84, 85, 85,
86, 86, 87, 87, 88, 88, 89, 89, 90, 90, 91, 91, 92, 92, 93, 93, 94, 94, 95, 95, 96, 96, 97, 97, 98, 98, 99, 99, 100, 100, 101, 101,
102, 102, 103, 103, 104, 104, 105, 105, 106, 106, 107, 107, 108, 108, 109, 109, 110, 110, 111, 111, 112, 112, 113, 113, 114, 114, 115, 115, 116, 116, 117, 117,
118, 118, 119, 119, 120, 120, 121, 121, 122, 122, 123, 123, 124, 124, 125, 125, 126, 126, 127, 127, 128, 128, 129, 129, 130, 130, 131, 131, 132, 132, 133, 133,
134, 134, 135, 135, 136, 136, 137, 137, 138, 138, 139, 139, 140, 140, 141, 141, 142, 142, 143, 143, 144, 144, 145, 145, 146, 146, 147, 147, 148, 148, 149, 149,
150, 150, 151, 151, 152, 152, 153, 153, 154, 154, 155, 155, 156, 156, 157, 157, 158, 158, 159, 159, 160, 160, 161, 161, 162, 162, 163, 163, 164, 164, 165, 165,
166, 166, 167, 167, 168, 168, 169, 169, 170, 170, 171, 171, 172, 172, 173, 173, 174, 174, 175, 175, 176, 176, 177, 177, 178, 178, 179, 179, 180, 180, 181, 181,
182, 182, 183, 183, 184, 184, 185, 185, 186, 186, 187, 187, 188, 188, 189, 189, 190, 190, 191, 191, 192, 192, 193, 193, 194, 194, 195, 195, 196, 196, 197, 197,
198, 198, 199, 199, 200, 200, 201, 201, 202, 202, 203, 203, 204, 204, 205, 205, 206, 206, 207, 207, 208, 208, 209, 209, 210, 210, 211, 211, 212, 212, 213, 213,
214, 214, 215, 215, 216, 216, 217, 217, 218, 218, 219, 219, 220, 220, 221, 221, 222, 222, 223, 223, 224, 224, 225, 225, 226, 226, 227, 227, 228, 228, 229, 229,
230, 230, 231, 231, 232, 232, 233, 233, 234, 234, 235, 235, 236, 236, 237, 237, 238, 238, 239, 239, 240, 240, 241, 241, 242, 242, 243, 243, 244, 244, 245, 245,
246, 246, 247, 247, 248, 248, 249, 249, 250, 250, 251, 251, 252, 252, 253, 253, 254, 254, 255, 255, 99, 117, 114, 118, 0, 0, 0, 0, 0, 0, 1, 0,
3, 83, 4, 56, 5, 30, 6, 3, 6, 232, 7, 205, 8, 178, 9, 151, 10, 125, 11, 98, 12, 71, 13, 44, 14, 17, 14, 247, 15, 220, 16, 193,
17, 166, 18, 139, 19, 112, 20, 86, 21, 59, 22, 32, 23, 5, 23, 234, 24, 208, 25, 181, 26, 154, 27, 127, 28, 100, 29, 74, 30, 47, 31, 20,
31, 249, 32, 222, 33, 195, 34, 169, 35, 142, 36, 115, 37, 88, 38, 61, 39, 35, 40, 8, 40, 237, 41, 210, 42, 183, 43, 156, 44, 130, 45, 103,
46, 76, 47, 49, 48, 22, 48, 252, 49, 225, 50, 198, 51, 171, 52, 144, 53, 117, 54, 91, 55, 64, 56, 37, 57, 10, 57, 239, 58, 213, 59, 186,
60, 159, 61, 132, 62, 105, 63, 79, 64, 52, 65, 25, 65, 254, 66, 227, 67, 200, 68, 174, 69, 147, 70, 120, 71, 93, 72, 66, 73, 40, 74, 13,
74, 242, 75, 215, 76, 188, 77, 161, 78, 135, 79, 108, 80, 81, 81, 54, 82, 27, 83, 1, 83, 230, 84, 203, 85, 176, 86, 149, 87, 122, 88, 96,
89, 69, 90, 42, 91, 15, 91, 244, 92, 218, 93, 191, 94, 164, 95, 137, 96, 110, 97, 84, 98, 57, 99, 30, 100, 3, 100, 232, 101, 205, 102, 179,
103, 152, 104, 125, 105, 98, 106, 71, 107, 45, 108, 18, 108, 247, 109, 220, 110, 193, 111, 166, 112, 140, 113, 113, 114, 86, 115, 59, 116, 32, 117, 6,
117, 235, 118, 208, 119, 181, 120, 154, 121, 127, 122, 101, 123, 74, 124, 47, 125, 20, 125, 249, 126, 223, 127, 196, 128, 169, 129, 142, 130, 115, 131, 89,
132, 62, 133, 35, 134, 8, 134, 237, 135, 210, 136, 184, 137, 157, 138, 130, 139, 103, 140, 76, 141, 50, 142, 23, 142, 252, 143, 225, 144, 198, 145, 171,
146, 145, 147, 118, 148, 91, 149, 64, 150, 37, 151, 11, 151, 240, 152, 213, 153, 186, 154, 159, 155, 132, 156, 106, 157, 79, 158, 52, 159, 25, 159, 254,
160, 228, 161, 201, 162, 174, 163, 147, 164, 120, 165, 94, 166, 67, 167, 40, 168, 13, 168, 242, 169, 215, 170, 189, 171, 162, 172, 135, 173, 108, 174, 81,
175, 55, 176, 28, 177, 1, 177, 230, 178, 203, 179, 176, 180, 150, 181, 123, 182, 96, 183, 69, 184, 42, 185, 16, 185, 245, 186, 218, 187, 191, 188, 164,
189, 137, 190, 111, 191, 84, 192, 57, 193, 30, 194, 3, 194, 233, 195, 206, 196, 179, 197, 152, 198, 125, 199, 99, 200, 72, 201, 45, 202, 18, 202, 247,
203, 220, 204, 194, 205, 167, 206, 140, 207, 113, 208, 86, 209, 60, 210, 33, 211, 6, 211, 235, 212, 208, 213, 181, 214, 155, 215, 128, 216, 101, 217, 74,
218, 47, 219, 21, 219, 250, 220, 223, 221, 196, 222, 169, 223, 143, 224, 116, 225, 89, 226, 62, 227, 35, 228, 8, 228, 238, 229, 211, 230, 184, 231, 157,
99, 117, 114, 118, 0, 0, 0, 0, 0, 0, 1, 0, 6, 173, 7, 118, 8, 63, 9, 8, 9, 210, 10, 155, 11, 100, 12, 45, 12, 246, 13, 191,
14, 137, 15, 82, 16, 27, 16, 228, 17, 173, 18, 118, 19, 63, 20, 9, 20, 210, 21, 155, 22, 100, 23, 45, 23, 246, 24, 191, 25, 137, 26, 82,
27, 27, 27, 228, 28, 173, 29, 118, 30, 64, 31, 9, 31, 210, 32, 155, 33, 100, 34, 45, 34, 246, 35, 192, 36, 137, 37, 82, 38, 27, 38, 228,
39, 173, 40, 118, 41, 64, 42, 9, 42, 210, 43, 155, 44, 100, 45, 45, 45, 247, 46, 192, 47, 137, 48, 82, 49, 27, 49, 228, 50, 173, 51, 119,
52, 64, 53, 9, 53, 210, 54, 155, 55, 100, 56, 45, 56, 247, 57, 192, 58, 137, 59, 82, 60, 27, 60, 228, 61, 173, 62, 119, 63, 64, 64, 9,
64, 210, 65, 155, 66, 100, 67, 46, 67, 247, 68, 192, 69, 137, 70, 82, 71, 27, 71, 228, 72, 174, 73, 119, 74, 64, 75, 9, 75, 210, 76, 155,
77, 100, 78, 46, 78, 247, 79, 192, 80, 137, 81, 82, 82, 27, 82, 229, 83, 174, 84, 119, 85, 64, 86, 9, 86, 210, 87, 155, 88, 101, 89, 46,
89, 247, 90, 192, 91, 137, 92, 82, 93, 27, 93, 229, 94, 174, 95, 119, 96, 64, 97, 9, 97, 210, 98, 156, 99, 101, 100, 46, 100, 247, 101, 192,
102, 137, 103, 82, 104, 28, 104, 229, 105, 174, 106, 119, 107, 64, 108, 9, 108, 210, 109, 156, 110, 101, 111, 46, 111, 247, 112, 192, 113, 137, 114, 83,
115, 28, 115, 229, 116, 174, 117, 119, 118, 64, 119, 9, 119, 211, 120, 156, 121, 101, 122, 46, 122, 247, 123, 192, 124, 137, 125, 83, 126, 28, 126, 229,
127, 174, 128, 119, 129, 64, 130, 9, 130, 211, 131, 156, 132, 101, 133, 46, 133, 247, 134, 192, 135, 138, 136, 83, 137, 28, 137, 229, 138, 174, 139, 119,
140, 64, 141, 10, 141, 211, 142, 156, 143, 101, 144, 46, 144, 247, 145, 192, 146, 138, 147, 83, 148, 28, 148, 229, 149, 174, 150, 119, 151, 65, 152, 10,
152, 211, 153, 156, 154, 101, 155, 46, 155, 247, 156, 193, 157, 138, 158, 83, 159, 28, 159, 229, 160, 174, 161, 119, 162, 65, 163, 10, 163, 211, 164, 156,
165, 101, 166, 46, 166, 248, 167, 193, 168, 138, 169, 83, 170, 28, 170, 229, 171, 174, 172, 120, 173, 65, 174, 10, 174, 211, 175, 156, 176, 101, 177, 46,
177, 248, 178, 193, 179, 138, 180, 83, 181, 28, 181, 229, 182, 175, 183, 120, 184, 65, 185, 10, 185, 211, 186, 156, 187, 101, 188, 47, 188, 248, 189, 193,
190, 138, 191, 83, 192, 28, 192, 229, 193, 175, 194, 120, 195, 65, 196, 10, 196, 211, 197, 156, 198, 102, 199, 47, 199, 248, 200, 193, 201, 138, 202, 83,
203, 28, 203, 230, 204, 175, 205, 120, 206, 65, 207, 10, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0,
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 0, 0, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 255, 255,
0, 0, 255, 255, 255, 255, 255, 255, 0, 0, 255, 255, 255, 255, 255, 255, 99, 117, 114, 118, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1,
2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17,
18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31, 32, 32, 33, 33,
34, 34, 35, 35, 36, 36, 37, 37, 38, 38, 39, 39, 40, 40, 41, 41, 42, 42, 43, 43, 44, 44, 45, 45, 46, 46, 47, 47, 48, 48, 49, 49,
50, 50, 51, 51, 52, 52, 53, 53, 54, 54, 55, 55, 56, 56, 57, 57, 58, 58, 59, 59, 60, 60, 61, 61, 62, 62, 63, 63, 64, 64, 65, 65,
66, 66, 67, 67, 68, 68, 69, 69, 70, 70, 71, 71, 72, 72, 73, 73, 74, 74, 75, 75, 76, 76, 77, 77, 78, 78, 79, 79, 80, 80, 81, 81,
82, 82, 83, 83, 84, 84, 85, 85, 86, 86, 87, 87, 88, 88, 89, 89, 90, 90, 91, 91, 92, 92, 93, 93, 94, 94, 95, 95, 96, 96, 97, 97,
98, 98, 99, 99, 100, 100, 101, 101, 102, 102, 103, 103, 104, 104, 105, 105, 106, 106, 107, 107, 108, 108, 109, 109, 110, 110, 111, 111, 112, 112, 113, 113,
114, 114, 115, 115, 116, 116, 117, 117, 118, 118, 119, 119, 120, 120, 121, 121, 122, 122, 123, 123, 124, 124, 125, 125, 126, 126, 127, 127, 128, 128, 129, 129,
130, 130, 131, 131, 132, 132, 133, 133, 134, 134, 135, 135, 136, 136, 137, 137, 138, 138, 139, 139, 140, 140, 141, 141, 142, 142, 143, 143, 144, 144, 145, 145,
146, 146, 147, 147, 148, 148, 149, 149, 150, 150, 151, 151, 152, 152, 153, 153, 154, 154, 155, 155, 156, 156, 157, 157, 158, 158, 159, 159, 160, 160, 161, 161,
162, 162, 163, 163, 164, 164, 165, 165, 166, 166, 167, 167, 168, 168, 169, 169, 170, 170, 171, 171, 172, 172, 173, 173, 174, 174, 175, 175, 176, 176, 177, 177,
178, 178, 179, 179, 180, 180, 181, 181, 182, 182, 183, 183, 184, 184, 185, 185, 186, 186, 187, 187, 188, 188, 189, 189, 190, 190, 191, 191, 192, 192, 193, 193,
194, 194, 195, 195, 196, 196, 197, 197, 198, 198, 199, 199, 200, 200, 201, 201, 202, 202, 203, 203, 204, 204, 205, 205, 206, 206, 207, 207, 208, 208, 209, 209,
210, 210, 211, 211, 212, 212, 213, 213, 214, 214, 215, 215, 216, 216, 217, 217, 218, 218, 219, 219, 220, 220, 221, 221, 222, 222, 223, 223, 224, 224, 225, 225,
226, 226, 227, 227, 228, 228, 229, 229, 230, 230, 231, 231, 232, 232, 233, 233, 234, 234, 235, 235, 236, 236, 237, 237, 238, 238, 239, 239, 240, 240, 241, 241,
242, 242, 243, 243, 244, 244, 245, 245, 246, 246, 247, 247, 248, 248, 249, 249, 250, 250, 251, 251, 252, 252, 253, 253, 254, 254, 255, 255, 99, 117, 114, 118,
0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11,
12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
28, 28, 29, 29, 30, 30, 31, 31, 32, 32, 33, 33, 34, 34, 35, 35, 36, 36, 37, 37, 38, 38, 39, 39, 40, 40, 41, 41, 42, 42, 43, 43,
44, 44, 45, 45, 46, 46, 47, 47, 48, 48, 49, 49, 50, 50, 51, 51, 52, 52, 53, 53, 54, 54, 55, 55, 56, 56, 57, 57, 58, 58, 59, 59,
60, 60, 61, 61, 62, 62, 63, 63, 64, 64, 65, 65, 66, 66, 67, 67, 68, 68, 69, 69, 70, 70, 71, 71, 72, 72, 73, 73, 74, 74, 75, 75,
76, 76, 77, 77, 78, 78, 79, 79, 80, 80, 81, 81, 82, 82, 83, 83, 84, 84, 85, 85, 86, 86, 87, 87, 88, 88, 89, 89, 90, 90, 91, 91,
92, 92, 93, 93, 94, 94, 95, 95, 96, 96, 97, 97, 98, 98, 99, 99, 100, 100, 101, 101, 102, 102, 103, 103, 104, 104, 105, 105, 106, 106, 107, 107,
108, 108, 109, 109, 110, 110, 111, 111, 112, 112, 113, 113, 114, 114, 115, 115, 116, 116, 117, 117, 118, 118, 119, 119, 120, 120, 121, 121, 122, 122, 123, 123,
124, 124, 125, 125, 126, 126, 127, 127, 128, 128, 129, 129, 130, 130, 131, 131, 132, 132, 133, 133, 134, 134, 135, 135, 136, 136, 137, 137, 138, 138, 139, 139,
140, 140, 141, 141, 142, 142, 143, 143, 144, 144, 145, 145, 146, 146, 147, 147, 148, 148, 149, 149, 150, 150, 151, 151, 152, 152, 153, 153, 154, 154, 155, 155,
156, 156, 157, 157, 158, 158, 159, 159, 160, 160, 161, 161, 162, 162, 163, 163, 164, 164, 165, 165, 166, 166, 167, 167, 168, 168, 169, 169, 170, 170, 171, 171,
172, 172, 173, 173, 174, 174, 175, 175, 176, 176, 177, 177, 178, 178, 179, 179, 180, 180, 181, 181, 182, 182, 183, 183, 184, 184, 185, 185, 186, 186, 187, 187,
188, 188, 189, 189, 190, 190, 191, 191, 192, 192, 193, 193, 194, 194, 195, 195, 196, 196, 197, 197, 198, 198, 199, 199, 200, 200, 201, 201, 202, 202, 203, 203,
204, 204, 205, 205, 206, 206, 207, 207, 208, 208, 209, 209, 210, 210, 211, 211, 212, 212, 213, 213, 214, 214, 215, 215, 216, 216, 217, 217, 218, 218, 219, 219,
220, 220, 221, 221, 222, 222, 223, 223, 224, 224, 225, 225, 226, 226, 227, 227, 228, 228, 229, 229, 230, 230, 231, 231, 232, 232, 233, 233, 234, 234, 235, 235,
236, 236, 237, 237, 238, 238, 239, 239, 240, 240, 241, 241, 242, 242, 243, 243, 244, 244, 245, 245, 246, 246, 247, 247, 248, 248, 249, 249, 250, 250, 251, 251,
252, 252, 253, 253, 254, 254, 255, 255, 99, 117, 114, 118, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5,
6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21,
22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31, 32, 32, 33, 33, 34, 34, 35, 35, 36, 36, 37, 37,
38, 38, 39, 39, 40, 40, 41, 41, 42, 42, 43, 43, 44, 44, 45, 45, 46, 46, 47, 47, 48, 48, 49, 49, 50, 50, 51, 51, 52, 52, 53, 53,
54, 54, 55, 55, 56, 56, 57, 57, 58, 58, 59, 59, 60, 60, 61, 61, 62, 62, 63, 63, 64, 64, 65, 65, 66, 66, 67, 67, 68, 68, 69, 69,
70, 70, 71, 71, 72, 72, 73, 73, 74, 74, 75, 75, 76, 76, 77, 77, 78, 78, 79, 79, 80, 80, 81, 81, 82, 82, 83, 83, 84, 84, 85, 85,
86, 86, 87, 87, 88, 88, 89, 89, 90, 90, 91, 91, 92, 92, 93, 93, 94, 94, 95, 95, 96, 96, 97, 97, 98, 98, 99, 99, 100, 100, 101, 101,
102, 102, 103, 103, 104, 104, 105, 105, 106, 106, 107, 107, 108, 108, 109, 109, 110, 110, 111, 111, 112, 112, 113, 113, 114, 114, 115, 115, 116, 116, 117, 117,
118, 118, 119, 119, 120, 120, 121, 121, 122, 122, 123, 123, 124, 124, 125, 125, 126, 126, 127, 127, 128, 128, 129, 129, 130, 130, 131, 131, 132, 132, 133, 133,
134, 134, 135, 135, 136, 136, 137, 137, 138, 138, 139, 139, 140, 140, 141, 141, 142, 142, 143, 143, 144, 144, 145, 145, 146, 146, 147, 147, 148, 148, 149, 149,
150, 150, 151, 151, 152, 152, 153, 153, 154, 154, 155, 155, 156, 156, 157, 157, 158, 158, 159, 159, 160, 160, 161, 161, 162, 162, 163, 163, 164, 164, 165, 165,
166, 166, 167, 167, 168, 168, 169, 169, 170, 170, 171, 171, 172, 172, 173, 173, 174, 174, 175, 175, 176, 176, 177, 177, 178, 178, 179, 179, 180, 180, 181, 181,
182, 182, 183, 183, 184, 184, 185, 185, 186, 186, 187, 187, 188, 188, 189, 189, 190, 190, 191, 191, 192, 192, 193, 193, 194, 194, 195, 195, 196, 196, 197, 197,
198, 198, 199, 199, 200, 200, 201, 201, 202, 202, 203, 203, 204, 204, 205, 205, 206, 206, 207, 207, 208, 208, 209, 209, 210, 210, 211, 211, 212, 212, 213, 213,
214, 214, 215, 215, 216, 216, 217, 217, 218, 218, 219, 219, 220, 220, 221, 221, 222, 222, 223, 223, 224, 224, 225, 225, 226, 226, 227, 227, 228, 228, 229, 229,
230, 230, 231, 231, 232, 232, 233, 233, 234, 234, 235, 235, 236, 236, 237, 237, 238, 238, 239, 239, 240, 240, 241, 241, 242, 242, 243, 243, 244, 244, 245, 245,
246, 246, 247, 247, 248, 248, 249, 249, 250, 250, 251, 251, 252, 252, 253, 253, 254, 254, 255, 255 );

createColorLookup = function(name, layer)
{
  try {
    activateLayer(layer);
    var desc0 = new ActionDescriptor();
    var ref0 = new ActionReference();
    ref0.putClass(cTID('AdjL'));
    desc0.putReference(cTID('null'), ref0);
    var desc1 = new ActionDescriptor();
    desc1.putClass(cTID('Type'), sTID("colorLookup"));
    desc0.putObject(cTID('Usng'), cTID('AdjL'), desc1);
    executeAction(cTID('Mk  '), desc0, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

setColorLookup = function(layer, lookup)
{
  try {
    activateLayer(layer);
    var idslct = cTID("slct");
    var desc70 = new ActionDescriptor();
    var idnull = cTID("null");
    var ref50 = new ActionReference();
    var idChnl = cTID("Chnl");
    var idChnl = cTID("Chnl");
    var idRGB = cTID("RGB ");
    ref50.putEnumerated(idChnl, idChnl, idRGB);
    desc70.putReference(idnull, ref50);
    var idMkVs = cTID("MkVs");
    desc70.putBoolean(idMkVs, false);
    executeAction(idslct, desc70, DialogModes.NO);

    var idsetd = cTID("setd");
    var desc71 = new ActionDescriptor();
    var idnull = cTID("null");
    var ref51 = new ActionReference();
    var idAdjL = cTID("AdjL");
    var idOrdn = cTID("Ordn");
    var idTrgt = cTID("Trgt");
    ref51.putEnumerated(idAdjL, idOrdn, idTrgt);
    desc71.putReference(idnull, ref51);
    var idT = cTID("T   ");
    var desc72 = new ActionDescriptor();
    var idlookupType = sTID("lookupType");
    var idcolorLookupType = sTID("colorLookupType");
    var idthreeDLUT = sTID("3DLUT");
    desc72.putEnumerated(idlookupType, idcolorLookupType, idthreeDLUT);
    var idNm = cTID("Nm  ");
    desc72.putString(idNm, lookup);
    var idprofile = sTID("profile");
    desc72.putData(idprofile, mystery_data);
    var idLUTFormat = sTID("LUTFormat");
    var idLUTFormatType = sTID("LUTFormatType");
    var idLUTFormatLOOK = sTID("LUTFormatLOOK");
    desc72.putEnumerated(idLUTFormat, idLUTFormatType, idLUTFormatLOOK);
    var idLUTthreeDFileData = sTID("LUT3DFileData");

    var f = new File(lookup);
    f.open('r');
    var ldata = f.read();
    f.close();

    desc72.putData(idLUTthreeDFileData, ldata);
    var idLUTthreeDFileName = sTID("LUT3DFileName");
    desc72.putString(idLUTthreeDFileName, lookup);
    var idcolorLookup = sTID("colorLookup");
    desc71.putObject(idT, idcolorLookup, desc72);
    executeAction(idsetd, desc71, DialogModes.NO);
  } catch (e) {
    log(e);
    return null;
  }
}

createCurveAdjustment = function(name, layer)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(cTID('AdjL'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    desc3.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindDefault"));
    desc2.putObject(cTID('Type'), cTID('Crvs'), desc3);
    desc1.putObject(cTID('Usng'), cTID('AdjL'), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

setCurveAdjustment = function(layer, data)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('AdjL'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var list1 = new ActionList();
    var desc3 = new ActionDescriptor();
    var ref2 = new ActionReference();
    ref2.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID('Cmps'));
    desc3.putReference(cTID('Chnl'), ref2);
    var list2 = new ActionList();
    for (var i = 0; i < data.length; ++i) {
      var desc4 = new ActionDescriptor();
      desc4.putDouble(cTID('Hrzn'), data[i][0]);
      desc4.putDouble(cTID('Vrtc'), data[i][1]);
      list2.putObject(cTID('Pnt '), desc4);
    }
    desc3.putList(cTID('Crv '), list2);
    list1.putObject(cTID('CrvA'), desc3);
    desc2.putList(cTID('Adjs'), list1);
    desc1.putObject(cTID('T   '), cTID('Crvs'), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}

curvePoint = function(pos, percentage)
{
  var p = (typeof percentage !== 'undefined') ?  percentage : 0;
  var v = pos + (p / 100.0 * 255);
  v = Math.max(v, 0);
  v = Math.min(v, 255);
  return [pos, v];
}

scurve = function(percentage, dark, light)
{
  return [curvePoint(0, dark), curvePoint(64, -1 * percentage),
          curvePoint(192, percentage), curvePoint(255, light)];
}

createChannelMixer = function(name, layer)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(cTID('AdjL'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    desc3.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindDefault"));
    var desc4 = new ActionDescriptor();
    desc4.putUnitDouble(cTID('Rd  '), cTID('#Prc'), 100);
    desc3.putObject(cTID('Rd  '), cTID('ChMx'), desc4);
    var desc5 = new ActionDescriptor();
    desc5.putUnitDouble(cTID('Grn '), cTID('#Prc'), 100);
    desc3.putObject(cTID('Grn '), cTID('ChMx'), desc5);
    var desc6 = new ActionDescriptor();
    desc6.putUnitDouble(cTID('Bl  '), cTID('#Prc'), 100);
    desc3.putObject(cTID('Bl  '), cTID('ChMx'), desc6);
    desc2.putObject(cTID('Type'), cTID('ChnM'), desc3);
    desc1.putObject(cTID('Usng'), cTID('AdjL'), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

setChannelMixer = function(layer, color, cnst, mono)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('AdjL'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindCustom"));
    desc2.putBoolean(cTID('Mnch'), mono);
    var desc3 = new ActionDescriptor();
    desc3.putUnitDouble(cTID('Rd  '), cTID('#Prc'), color[0]);
    desc3.putUnitDouble(cTID('Grn '), cTID('#Prc'), color[1]);
    desc3.putUnitDouble(cTID('Bl  '), cTID('#Prc'), color[2]);
    desc3.putUnitDouble(cTID('Cnst'), cTID('#Prc'), cnst);
    desc2.putObject(cTID('Gry '), cTID('ChMx'), desc3);
    desc1.putObject(cTID('T   '), cTID('ChnM'), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
     return false;
  }
}

createSolidColorAdjustment = function(name, layer, color)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(sTID("contentLayer"));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    var desc4 = new ActionDescriptor();
    desc4.putDouble(cTID('Rd  '), color[0]);
    desc4.putDouble(cTID('Grn '), color[1]);
    desc4.putDouble(cTID('Bl  '), color[2]);
    desc3.putObject(cTID('Clr '), sTID("RGBColor"), desc4);
    desc2.putObject(cTID('Type'), sTID("solidColorLayer"), desc3);
    desc1.putObject(cTID('Usng'), sTID("contentLayer"), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
     return null;
  }
};

createHueSaturationAdjustment = function(name, layer)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(cTID('AdjL'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    desc3.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindDefault"));
    desc3.putBoolean(cTID('Clrz'), false);
    desc2.putObject(cTID('Type'), cTID('HStr'), desc3);
    desc1.putObject(cTID('Usng'), cTID('AdjL'), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

setHueSaturationAdjustment = function(layer, hue, saturation, lightness)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('AdjL'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindCustom"));
    var list1 = new ActionList();
    var desc3 = new ActionDescriptor();
    desc3.putInteger(cTID('H   '), hue);
    desc3.putInteger(cTID('Strt'), saturation);
    desc3.putInteger(cTID('Lght'), lightness);
    list1.putObject(cTID('Hst2'), desc3);
    desc2.putList(cTID('Adjs'), list1);
    desc1.putObject(cTID('T   '), cTID('HStr'), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}

createSelectiveColorAdjustment = function(name, layer)
{
  try {
    activateLayer(layer);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(cTID('AdjL'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    desc3.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindDefault"));
    desc2.putObject(cTID('Type'), cTID('SlcC'), desc3);
    desc1.putObject(cTID('Usng'), cTID('AdjL'), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    app.activeDocument.activeLayer.name = name;
    return app.activeDocument.activeLayer;
  } catch (e) {
    log(e);
    return null;
  }
}

setSelectiveColorAdjustment = function(layer, values, absolute)
{
  var colors = {'reds': 'Rds ', 'yellows': 'Ylws', 'greens': 'Grns', 'cyans': 'Cyns',
                'blues': 'Bls ', 'magentas': 'Mgnt', 'whites': 'Whts', 'neutrals': 'Ntrl',
                'blacks': 'Blks'}
  try {
    activateLayer(layer);
    for (v in values) {
      var desc1 = new ActionDescriptor();
      var ref1 = new ActionReference();
      ref1.putEnumerated(cTID('AdjL'), cTID('Ordn'), cTID('Trgt'));
      desc1.putReference(cTID('null'), ref1);
      var desc2 = new ActionDescriptor();
      var list1 = new ActionList();
      var desc3 = new ActionDescriptor();
      desc3.putEnumerated(cTID('Clrs'), cTID('Clrs'), cTID(colors[values[v][0]]));
      desc3.putUnitDouble(cTID('Cyn '), cTID('#Prc'), values[v][1][0]);
      desc3.putUnitDouble(cTID('Mgnt'), cTID('#Prc'), values[v][1][1]);
      desc3.putUnitDouble(cTID('Ylw '), cTID('#Prc'), values[v][1][2]);
      desc3.putUnitDouble(cTID('Blck'), cTID('#Prc'), values[v][1][3]);
      list1.putObject(cTID('ClrC'), desc3);
      desc2.putList(cTID('ClrC'), list1);
      desc1.putObject(cTID('T   '), cTID('SlcC'), desc2);
      executeAction(cTID('setd'), desc1, DialogModes.NO);
    }
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('AdjL'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    if (absolute) {
      desc2.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindCustom"));
      desc2.putEnumerated(cTID('Mthd'), cTID('CrcM'), cTID('Absl'));
    } else {
      desc2.putEnumerated(cTID('Mthd'), cTID('CrcM'), cTID('Rltv'));
    }
    desc1.putObject(cTID('T   '), cTID('SlcC'), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
    return true;
  } catch (e) {
    log(e);
    return false;
  }
}
