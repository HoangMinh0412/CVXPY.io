// This is a part of the Active Template Library.
// Copyright (C) Microsoft Corporation
// All rights reserved.
//
// This source code is only intended as a supplement to the
// Active Template Library Reference and related
// electronic documentation provided with the library.
// See these sources for detailed information regarding the
// Active Template Library product.

#include "stdafx.H"

// C4073 - initializers put in library initialization area
// C4740 - flow in or out of inline asm code suppresses global optimization
#pragma warning( disable: 4073 4740 )

namespace ATL
{

inline static void WINAPI atlBadThunkCall()
{
	ATLASSERT(FALSE && "Call through deleted thunk");
}

#if defined(_M_IX86)

#define ATL_IMPL_THUNK(n)\
__declspec(naked) HRESULT _QIThunk::f##n()\
{\
	__asm mov eax, [esp+4]  /* eax = this */ \
	__asm cmp dword ptr [eax+8], 0  /* if( this->m_dwRef > 0 ) */ \
	__asm jg goodref\
	__asm call atlBadThunkCall\
	__asm goodref:\
	__asm mov eax, [esp+4]  /* eax = this */ \
	__asm mov eax, dword ptr [eax+4]  /* eax = this->m_pUnk */ \
	__asm mov [esp+4], eax  /* this = m_pUnk */ \
	__asm mov eax, dword ptr [eax]  /* eax = m_pUnk->vtbl */ \
	__asm mov eax, dword ptr [eax+4*n]  /* eax = this->vtbl[n] */ \
	__asm jmp eax  /* call the real method on m_pUnk */ \
}

ATL_IMPL_THUNK(3)
ATL_IMPL_THUNK(4)
ATL_IMPL_THUNK(5)
ATL_IMPL_THUNK(6)
ATL_IMPL_THUNK(7)
ATL_IMPL_THUNK(8)
ATL_IMPL_THUNK(9)
ATL_IMPL_THUNK(10)
ATL_IMPL_THUNK(11)
ATL_IMPL_THUNK(12)
ATL_IMPL_THUNK(13)
ATL_IMPL_THUNK(14)
ATL_IMPL_THUNK(15)
ATL_IMPL_THUNK(16)
ATL_IMPL_THUNK(17)
ATL_IMPL_THUNK(18)
ATL_IMPL_THUNK(19)
ATL_IMPL_THUNK(20)
ATL_IMPL_THUNK(21)
ATL_IMPL_THUNK(22)
ATL_IMPL_THUNK(23)
ATL_IMPL_THUNK(24)
ATL_IMPL_THUNK(25)
ATL_IMPL_THUNK(26)
ATL_IMPL_THUNK(27)
ATL_IMPL_THUNK(28)
ATL_IMPL_THUNK(29)
ATL_IMPL_THUNK(30)
ATL_IMPL_THUNK(31)
ATL_IMPL_THUNK(32)
ATL_IMPL_THUNK(33)
ATL_IMPL_THUNK(34)
ATL_IMPL_THUNK(35)
ATL_IMPL_THUNK(36)
ATL_IMPL_THUNK(37)
ATL_IMPL_THUNK(38)
ATL_IMPL_THUNK(39)
ATL_IMPL_THUNK(40)
ATL_IMPL_THUNK(41)
ATL_IMPL_THUNK(42)
ATL_IMPL_THUNK(43)
ATL_IMPL_THUNK(44)
ATL_IMPL_THUNK(45)
ATL_IMPL_THUNK(46)
ATL_IMPL_THUNK(47)
ATL_IMPL_THUNK(48)
ATL_IMPL_THUNK(49)
ATL_IMPL_THUNK(50)
ATL_IMPL_THUNK(51)
ATL_IMPL_THUNK(52)
ATL_IMPL_THUNK(53)
ATL_IMPL_THUNK(54)
ATL_IMPL_THUNK(55)
ATL_IMPL_THUNK(56)
ATL_IMPL_THUNK(57)
ATL_IMPL_THUNK(58)
ATL_IMPL_THUNK(59)
ATL_IMPL_THUNK(60)
ATL_IMPL_THUNK(61)
ATL_IMPL_THUNK(62)
ATL_IMPL_THUNK(63)
ATL_IMPL_THUNK(64)
ATL_IMPL_THUNK(65)
ATL_IMPL_THUNK(66)
ATL_IMPL_THUNK(67)
ATL_IMPL_THUNK(68)
ATL_IMPL_THUNK(69)
ATL_IMPL_THUNK(70)
ATL_IMPL_THUNK(71)
ATL_IMPL_THUNK(72)
ATL_IMPL_THUNK(73)
ATL_IMPL_THUNK(74)
ATL_IMPL_THUNK(75)
ATL_IMPL_THUNK(76)
ATL_IMPL_THUNK(77)
ATL_IMPL_THUNK(78)
ATL_IMPL_THUNK(79)
ATL_IMPL_THUNK(80)
ATL_IMPL_THUNK(81)
ATL_IMPL_THUNK(82)
ATL_IMPL_THUNK(83)
ATL_IMPL_THUNK(84)
ATL_IMPL_THUNK(85)
ATL_IMPL_THUNK(86)
ATL_IMPL_THUNK(87)
ATL_IMPL_THUNK(88)
ATL_IMPL_THUNK(89)
ATL_IMPL_THUNK(90)
ATL_IMPL_THUNK(91)
ATL_IMPL_THUNK(92)
ATL_IMPL_THUNK(93)
ATL_IMPL_THUNK(94)
ATL_IMPL_THUNK(95)
ATL_IMPL_THUNK(96)
ATL_IMPL_THUNK(97)
ATL_IMPL_THUNK(98)
ATL_IMPL_THUNK(99)
ATL_IMPL_THUNK(100)
ATL_IMPL_THUNK(101)
ATL_IMPL_THUNK(102)
ATL_IMPL_THUNK(103)
ATL_IMPL_THUNK(104)
ATL_IMPL_THUNK(105)
ATL_IMPL_THUNK(106)
ATL_IMPL_THUNK(107)
ATL_IMPL_THUNK(108)
ATL_IMPL_THUNK(109)
ATL_IMPL_THUNK(110)
ATL_IMPL_THUNK(111)
ATL_IMPL_THUNK(112)
ATL_IMPL_THUNK(113)
ATL_IMPL_THUNK(114)
ATL_IMPL_THUNK(115)
ATL_IMPL_THUNK(116)
ATL_IMPL_THUNK(117)
ATL_IMPL_THUNK(118)
ATL_IMPL_THUNK(119)
ATL_IMPL_THUNK(120)
ATL_IMPL_THUNK(121)
ATL_IMPL_THUNK(122)
ATL_IMPL_THUNK(123)
ATL_IMPL_THUNK(124)
ATL_IMPL_THUNK(125)
ATL_IMPL_THUNK(126)
ATL_IMPL_THUNK(127)
ATL_IMPL_THUNK(128)
ATL_IMPL_THUNK(129)
ATL_IMPL_THUNK(130)
ATL_IMPL_THUNK(131)
ATL_IMPL_THUNK(132)
ATL_IMPL_THUNK(133)
ATL_IMPL_THUNK(134)
ATL_IMPL_THUNK(135)
ATL_IMPL_THUNK(136)
ATL_IMPL_THUNK(137)
ATL_IMPL_THUNK(138)
ATL_IMPL_THUNK(139)
ATL_IMPL_THUNK(140)
ATL_IMPL_THUNK(141)
ATL_IMPL_THUNK(142)
ATL_IMPL_THUNK(143)
ATL_IMPL_THUNK(144)
ATL_IMPL_THUNK(145)
ATL_IMPL_THUNK(146)
ATL_IMPL_THUNK(147)
ATL_IMPL_THUNK(148)
ATL_IMPL_THUNK(149)
ATL_IMPL_THUNK(150)
ATL_IMPL_THUNK(151)
ATL_IMPL_THUNK(152)
ATL_IMPL_THUNK(153)
ATL_IMPL_THUNK(154)
ATL_IMPL_THUNK(155)
ATL_IMPL_THUNK(156)
ATL_IMPL_THUNK(157)
ATL_IMPL_THUNK(158)
ATL_IMPL_THUNK(159)
ATL_IMPL_THUNK(160)
ATL_IMPL_THUNK(161)
ATL_IMPL_THUNK(162)
ATL_IMPL_THUNK(163)
ATL_IMPL_THUNK(164)
ATL_IMPL_THUNK(165)
ATL_IMPL_THUNK(166)
ATL_IMPL_THUNK(167)
ATL_IMPL_THUNK(168)
ATL_IMPL_THUNK(169)
ATL_IMPL_THUNK(170)
ATL_IMPL_THUNK(171)
ATL_IMPL_THUNK(172)
ATL_IMPL_THUNK(173)
ATL_IMPL_THUNK(174)
ATL_IMPL_THUNK(175)
ATL_IMPL_THUNK(176)
ATL_IMPL_THUNK(177)
ATL_IMPL_THUNK(178)
ATL_IMPL_THUNK(179)
ATL_IMPL_THUNK(180)
ATL_IMPL_THUNK(181)
ATL_IMPL_THUNK(182)
ATL_IMPL_THUNK(183)
ATL_IMPL_THUNK(184)
ATL_IMPL_THUNK(185)
ATL_IMPL_THUNK(186)
ATL_IMPL_THUNK(187)
ATL_IMPL_THUNK(188)
ATL_IMPL_THUNK(189)
ATL_IMPL_THUNK(190)
ATL_IMPL_THUNK(191)
ATL_IMPL_THUNK(192)
ATL_IMPL_THUNK(193)
ATL_IMPL_THUNK(194)
ATL_IMPL_THUNK(195)
ATL_IMPL_THUNK(196)
ATL_IMPL_THUNK(197)
ATL_IMPL_THUNK(198)
ATL_IMPL_THUNK(199)
ATL_IMPL_THUNK(200)
ATL_IMPL_THUNK(201)
ATL_IMPL_THUNK(202)
ATL_IMPL_THUNK(203)
ATL_IMPL_THUNK(204)
ATL_IMPL_THUNK(205)
ATL_IMPL_THUNK(206)
ATL_IMPL_THUNK(207)
ATL_IMPL_THUNK(208)
ATL_IMPL_THUNK(209)
ATL_IMPL_THUNK(210)
ATL_IMPL_THUNK(211)
ATL_IMPL_THUNK(212)
ATL_IMPL_THUNK(213)
ATL_IMPL_THUNK(214)
ATL_IMPL_THUNK(215)
ATL_IMPL_THUNK(216)
ATL_IMPL_THUNK(217)
ATL_IMPL_THUNK(218)
ATL_IMPL_THUNK(219)
ATL_IMPL_THUNK(220)
ATL_IMPL_THUNK(221)
ATL_IMPL_THUNK(222)
ATL_IMPL_THUNK(223)
ATL_IMPL_THUNK(224)
ATL_IMPL_THUNK(225)
ATL_IMPL_THUNK(226)
ATL_IMPL_THUNK(227)
ATL_IMPL_THUNK(228)
ATL_IMPL_THUNK(229)
ATL_IMPL_THUNK(230)
ATL_IMPL_THUNK(231)
ATL_IMPL_THUNK(232)
ATL_IMPL_THUNK(233)
ATL_IMPL_THUNK(234)
ATL_IMPL_THUNK(235)
ATL_IMPL_THUNK(236)
ATL_IMPL_THUNK(237)
ATL_IMPL_THUNK(238)
ATL_IMPL_THUNK(239)
ATL_IMPL_THUNK(240)
ATL_IMPL_THUNK(241)
ATL_IMPL_THUNK(242)
ATL_IMPL_THUNK(243)
ATL_IMPL_THUNK(244)
ATL_IMPL_THUNK(245)
ATL_IMPL_THUNK(246)
ATL_IMPL_THUNK(247)
ATL_IMPL_THUNK(248)
ATL_IMPL_THUNK(249)
ATL_IMPL_THUNK(250)
ATL_IMPL_THUNK(251)
ATL_IMPL_THUNK(252)
ATL_IMPL_THUNK(253)
ATL_IMPL_THUNK(254)
ATL_IMPL_THUNK(255)
ATL_IMPL_THUNK(256)
ATL_IMPL_THUNK(257)
ATL_IMPL_THUNK(258)
ATL_IMPL_THUNK(259)
ATL_IMPL_THUNK(260)
ATL_IMPL_THUNK(261)
ATL_IMPL_THUNK(262)
ATL_IMPL_THUNK(263)
ATL_IMPL_THUNK(264)
ATL_IMPL_THUNK(265)
ATL_IMPL_THUNK(266)
ATL_IMPL_THUNK(267)
ATL_IMPL_THUNK(268)
ATL_IMPL_THUNK(269)
ATL_IMPL_THUNK(270)
ATL_IMPL_THUNK(271)
ATL_IMPL_THUNK(272)
ATL_IMPL_THUNK(273)
ATL_IMPL_THUNK(274)
ATL_IMPL_THUNK(275)
ATL_IMPL_THUNK(276)
ATL_IMPL_THUNK(277)
ATL_IMPL_THUNK(278)
ATL_IMPL_THUNK(279)
ATL_IMPL_THUNK(280)
ATL_IMPL_THUNK(281)
ATL_IMPL_THUNK(282)
ATL_IMPL_THUNK(283)
ATL_IMPL_THUNK(284)
ATL_IMPL_THUNK(285)
ATL_IMPL_THUNK(286)
ATL_IMPL_THUNK(287)
ATL_IMPL_THUNK(288)
ATL_IMPL_THUNK(289)
ATL_IMPL_THUNK(290)
ATL_IMPL_THUNK(291)
ATL_IMPL_THUNK(292)
ATL_IMPL_THUNK(293)
ATL_IMPL_THUNK(294)
ATL_IMPL_THUNK(295)
ATL_IMPL_THUNK(296)
ATL_IMPL_THUNK(297)
ATL_IMPL_THUNK(298)
ATL_IMPL_THUNK(299)
ATL_IMPL_THUNK(300)
ATL_IMPL_THUNK(301)
ATL_IMPL_THUNK(302)
ATL_IMPL_THUNK(303)
ATL_IMPL_THUNK(304)
ATL_IMPL_THUNK(305)
ATL_IMPL_THUNK(306)
ATL_IMPL_THUNK(307)
ATL_IMPL_THUNK(308)
ATL_IMPL_THUNK(309)
ATL_IMPL_THUNK(310)
ATL_IMPL_THUNK(311)
ATL_IMPL_THUNK(312)
ATL_IMPL_THUNK(313)
ATL_IMPL_THUNK(314)
ATL_IMPL_THUNK(315)
ATL_IMPL_THUNK(316)
ATL_IMPL_THUNK(317)
ATL_IMPL_THUNK(318)
ATL_IMPL_THUNK(319)
ATL_IMPL_THUNK(320)
ATL_IMPL_THUNK(321)
ATL_IMPL_THUNK(322)
ATL_IMPL_THUNK(323)
ATL_IMPL_THUNK(324)
ATL_IMPL_THUNK(325)
ATL_IMPL_THUNK(326)
ATL_IMPL_THUNK(327)
ATL_IMPL_THUNK(328)
ATL_IMPL_THUNK(329)
ATL_IMPL_THUNK(330)
ATL_IMPL_THUNK(331)
ATL_IMPL_THUNK(332)
ATL_IMPL_THUNK(333)
ATL_IMPL_THUNK(334)
ATL_IMPL_THUNK(335)
ATL_IMPL_THUNK(336)
ATL_IMPL_THUNK(337)
ATL_IMPL_THUNK(338)
ATL_IMPL_THUNK(339)
ATL_IMPL_THUNK(340)
ATL_IMPL_THUNK(341)
ATL_IMPL_THUNK(342)
ATL_IMPL_THUNK(343)
ATL_IMPL_THUNK(344)
ATL_IMPL_THUNK(345)
ATL_IMPL_THUNK(346)
ATL_IMPL_THUNK(347)
ATL_IMPL_THUNK(348)
ATL_IMPL_THUNK(349)
ATL_IMPL_THUNK(350)
ATL_IMPL_THUNK(351)
ATL_IMPL_THUNK(352)
ATL_IMPL_THUNK(353)
ATL_IMPL_THUNK(354)
ATL_IMPL_THUNK(355)
ATL_IMPL_THUNK(356)
ATL_IMPL_THUNK(357)
ATL_IMPL_THUNK(358)
ATL_IMPL_THUNK(359)
ATL_IMPL_THUNK(360)
ATL_IMPL_THUNK(361)
ATL_IMPL_THUNK(362)
ATL_IMPL_THUNK(363)
ATL_IMPL_THUNK(364)
ATL_IMPL_THUNK(365)
ATL_IMPL_THUNK(366)
ATL_IMPL_THUNK(367)
ATL_IMPL_THUNK(368)
ATL_IMPL_THUNK(369)
ATL_IMPL_THUNK(370)
ATL_IMPL_THUNK(371)
ATL_IMPL_THUNK(372)
ATL_IMPL_THUNK(373)
ATL_IMPL_THUNK(374)
ATL_IMPL_THUNK(375)
ATL_IMPL_THUNK(376)
ATL_IMPL_THUNK(377)
ATL_IMPL_THUNK(378)
ATL_IMPL_THUNK(379)
ATL_IMPL_THUNK(380)
ATL_IMPL_THUNK(381)
ATL_IMPL_THUNK(382)
ATL_IMPL_THUNK(383)
ATL_IMPL_THUNK(384)
ATL_IMPL_THUNK(385)
ATL_IMPL_THUNK(386)
ATL_IMPL_THUNK(387)
ATL_IMPL_THUNK(388)
ATL_IMPL_THUNK(389)
ATL_IMPL_THUNK(390)
ATL_IMPL_THUNK(391)
ATL_IMPL_THUNK(392)
ATL_IMPL_THUNK(393)
ATL_IMPL_THUNK(394)
ATL_IMPL_THUNK(395)
ATL_IMPL_THUNK(396)
ATL_IMPL_THUNK(397)
ATL_IMPL_THUNK(398)
ATL_IMPL_THUNK(399)
ATL_IMPL_THUNK(400)
ATL_IMPL_THUNK(401)
ATL_IMPL_THUNK(402)
ATL_IMPL_THUNK(403)
ATL_IMPL_THUNK(404)
ATL_IMPL_THUNK(405)
ATL_IMPL_THUNK(406)
ATL_IMPL_THUNK(407)
ATL_IMPL_THUNK(408)
ATL_IMPL_THUNK(409)
ATL_IMPL_THUNK(410)
ATL_IMPL_THUNK(411)
ATL_IMPL_THUNK(412)
ATL_IMPL_THUNK(413)
ATL_IMPL_THUNK(414)
ATL_IMPL_THUNK(415)
ATL_IMPL_THUNK(416)
ATL_IMPL_THUNK(417)
ATL_IMPL_THUNK(418)
ATL_IMPL_THUNK(419)
ATL_IMPL_THUNK(420)
ATL_IMPL_THUNK(421)
ATL_IMPL_THUNK(422)
ATL_IMPL_THUNK(423)
ATL_IMPL_THUNK(424)
ATL_IMPL_THUNK(425)
ATL_IMPL_THUNK(426)
ATL_IMPL_THUNK(427)
ATL_IMPL_THUNK(428)
ATL_IMPL_THUNK(429)
ATL_IMPL_THUNK(430)
ATL_IMPL_THUNK(431)
ATL_IMPL_THUNK(432)
ATL_IMPL_THUNK(433)
ATL_IMPL_THUNK(434)
ATL_IMPL_THUNK(435)
ATL_IMPL_THUNK(436)
ATL_IMPL_THUNK(437)
ATL_IMPL_THUNK(438)
ATL_IMPL_THUNK(439)
ATL_IMPL_THUNK(440)
ATL_IMPL_THUNK(441)
ATL_IMPL_THUNK(442)
ATL_IMPL_THUNK(443)
ATL_IMPL_THUNK(444)
ATL_IMPL_THUNK(445)
ATL_IMPL_THUNK(446)
ATL_IMPL_THUNK(447)
ATL_IMPL_THUNK(448)
ATL_IMPL_THUNK(449)
ATL_IMPL_THUNK(450)
ATL_IMPL_THUNK(451)
ATL_IMPL_THUNK(452)
ATL_IMPL_THUNK(453)
ATL_IMPL_THUNK(454)
ATL_IMPL_THUNK(455)
ATL_IMPL_THUNK(456)
ATL_IMPL_THUNK(457)
ATL_IMPL_THUNK(458)
ATL_IMPL_THUNK(459)
ATL_IMPL_THUNK(460)
ATL_IMPL_THUNK(461)
ATL_IMPL_THUNK(462)
ATL_IMPL_THUNK(463)
ATL_IMPL_THUNK(464)
ATL_IMPL_THUNK(465)
ATL_IMPL_THUNK(466)
ATL_IMPL_THUNK(467)
ATL_IMPL_THUNK(468)
ATL_IMPL_THUNK(469)
ATL_IMPL_THUNK(470)
ATL_IMPL_THUNK(471)
ATL_IMPL_THUNK(472)
ATL_IMPL_THUNK(473)
ATL_IMPL_THUNK(474)
ATL_IMPL_THUNK(475)
ATL_IMPL_THUNK(476)
ATL_IMPL_THUNK(477)
ATL_IMPL_THUNK(478)
ATL_IMPL_THUNK(479)
ATL_IMPL_THUNK(480)
ATL_IMPL_THUNK(481)
ATL_IMPL_THUNK(482)
ATL_IMPL_THUNK(483)
ATL_IMPL_THUNK(484)
ATL_IMPL_THUNK(485)
ATL_IMPL_THUNK(486)
ATL_IMPL_THUNK(487)
ATL_IMPL_THUNK(488)
ATL_IMPL_THUNK(489)
ATL_IMPL_THUNK(490)
ATL_IMPL_THUNK(491)
ATL_IMPL_THUNK(492)
ATL_IMPL_THUNK(493)
ATL_IMPL_THUNK(494)
ATL_IMPL_THUNK(495)
ATL_IMPL_THUNK(496)
ATL_IMPL_THUNK(497)
ATL_IMPL_THUNK(498)
ATL_IMPL_THUNK(499)
ATL_IMPL_THUNK(500)
ATL_IMPL_THUNK(501)
ATL_IMPL_THUNK(502)
ATL_IMPL_THUNK(503)
ATL_IMPL_THUNK(504)
ATL_IMPL_THUNK(505)
ATL_IMPL_THUNK(506)
ATL_IMPL_THUNK(507)
ATL_IMPL_THUNK(508)
ATL_IMPL_THUNK(509)
ATL_IMPL_THUNK(510)
ATL_IMPL_THUNK(511)
ATL_IMPL_THUNK(512)
ATL_IMPL_THUNK(513)
ATL_IMPL_THUNK(514)
ATL_IMPL_THUNK(515)
ATL_IMPL_THUNK(516)
ATL_IMPL_THUNK(517)
ATL_IMPL_THUNK(518)
ATL_IMPL_THUNK(519)
ATL_IMPL_THUNK(520)
ATL_IMPL_THUNK(521)
ATL_IMPL_THUNK(522)
ATL_IMPL_THUNK(523)
ATL_IMPL_THUNK(524)
ATL_IMPL_THUNK(525)
ATL_IMPL_THUNK(526)
ATL_IMPL_THUNK(527)
ATL_IMPL_THUNK(528)
ATL_IMPL_THUNK(529)
ATL_IMPL_THUNK(530)
ATL_IMPL_THUNK(531)
ATL_IMPL_THUNK(532)
ATL_IMPL_THUNK(533)
ATL_IMPL_THUNK(534)
ATL_IMPL_THUNK(535)
ATL_IMPL_THUNK(536)
ATL_IMPL_THUNK(537)
ATL_IMPL_THUNK(538)
ATL_IMPL_THUNK(539)
ATL_IMPL_THUNK(540)
ATL_IMPL_THUNK(541)
ATL_IMPL_THUNK(542)
ATL_IMPL_THUNK(543)
ATL_IMPL_THUNK(544)
ATL_IMPL_THUNK(545)
ATL_IMPL_THUNK(546)
ATL_IMPL_THUNK(547)
ATL_IMPL_THUNK(548)
ATL_IMPL_THUNK(549)
ATL_IMPL_THUNK(550)
ATL_IMPL_THUNK(551)
ATL_IMPL_THUNK(552)
ATL_IMPL_THUNK(553)
ATL_IMPL_THUNK(554)
ATL_IMPL_THUNK(555)
ATL_IMPL_THUNK(556)
ATL_IMPL_THUNK(557)
ATL_IMPL_THUNK(558)
ATL_IMPL_THUNK(559)
ATL_IMPL_THUNK(560)
ATL_IMPL_THUNK(561)
ATL_IMPL_THUNK(562)
ATL_IMPL_THUNK(563)
ATL_IMPL_THUNK(564)
ATL_IMPL_THUNK(565)
ATL_IMPL_THUNK(566)
ATL_IMPL_THUNK(567)
ATL_IMPL_THUNK(568)
ATL_IMPL_THUNK(569)
ATL_IMPL_THUNK(570)
ATL_IMPL_THUNK(571)
ATL_IMPL_THUNK(572)
ATL_IMPL_THUNK(573)
ATL_IMPL_THUNK(574)
ATL_IMPL_THUNK(575)
ATL_IMPL_THUNK(576)
ATL_IMPL_THUNK(577)
ATL_IMPL_THUNK(578)
ATL_IMPL_THUNK(579)
ATL_IMPL_THUNK(580)
ATL_IMPL_THUNK(581)
ATL_IMPL_THUNK(582)
ATL_IMPL_THUNK(583)
ATL_IMPL_THUNK(584)
ATL_IMPL_THUNK(585)
ATL_IMPL_THUNK(586)
ATL_IMPL_THUNK(587)
ATL_IMPL_THUNK(588)
ATL_IMPL_THUNK(589)
ATL_IMPL_THUNK(590)
ATL_IMPL_THUNK(591)
ATL_IMPL_THUNK(592)
ATL_IMPL_THUNK(593)
ATL_IMPL_THUNK(594)
ATL_IMPL_THUNK(595)
ATL_IMPL_THUNK(596)
ATL_IMPL_THUNK(597)
ATL_IMPL_THUNK(598)
ATL_IMPL_THUNK(599)
ATL_IMPL_THUNK(600)
ATL_IMPL_THUNK(601)
ATL_IMPL_THUNK(602)
ATL_IMPL_THUNK(603)
ATL_IMPL_THUNK(604)
ATL_IMPL_THUNK(605)
ATL_IMPL_THUNK(606)
ATL_IMPL_THUNK(607)
ATL_IMPL_THUNK(608)
ATL_IMPL_THUNK(609)
ATL_IMPL_THUNK(610)
ATL_IMPL_THUNK(611)
ATL_IMPL_THUNK(612)
ATL_IMPL_THUNK(613)
ATL_IMPL_THUNK(614)
ATL_IMPL_THUNK(615)
ATL_IMPL_THUNK(616)
ATL_IMPL_THUNK(617)
ATL_IMPL_THUNK(618)
ATL_IMPL_THUNK(619)
ATL_IMPL_THUNK(620)
ATL_IMPL_THUNK(621)
ATL_IMPL_THUNK(622)
ATL_IMPL_THUNK(623)
ATL_IMPL_THUNK(624)
ATL_IMPL_THUNK(625)
ATL_IMPL_THUNK(626)
ATL_IMPL_THUNK(627)
ATL_IMPL_THUNK(628)
ATL_IMPL_THUNK(629)
ATL_IMPL_THUNK(630)
ATL_IMPL_THUNK(631)
ATL_IMPL_THUNK(632)
ATL_IMPL_THUNK(633)
ATL_IMPL_THUNK(634)
ATL_IMPL_THUNK(635)
ATL_IMPL_THUNK(636)
ATL_IMPL_THUNK(637)
ATL_IMPL_THUNK(638)
ATL_IMPL_THUNK(639)
ATL_IMPL_THUNK(640)
ATL_IMPL_THUNK(641)
ATL_IMPL_THUNK(642)
ATL_IMPL_THUNK(643)
ATL_IMPL_THUNK(644)
ATL_IMPL_THUNK(645)
ATL_IMPL_THUNK(646)
ATL_IMPL_THUNK(647)
ATL_IMPL_THUNK(648)
ATL_IMPL_THUNK(649)
ATL_IMPL_THUNK(650)
ATL_IMPL_THUNK(651)
ATL_IMPL_THUNK(652)
ATL_IMPL_THUNK(653)
ATL_IMPL_THUNK(654)
ATL_IMPL_THUNK(655)
ATL_IMPL_THUNK(656)
ATL_IMPL_THUNK(657)
ATL_IMPL_THUNK(658)
ATL_IMPL_THUNK(659)
ATL_IMPL_THUNK(660)
ATL_IMPL_THUNK(661)
ATL_IMPL_THUNK(662)
ATL_IMPL_THUNK(663)
ATL_IMPL_THUNK(664)
ATL_IMPL_THUNK(665)
ATL_IMPL_THUNK(666)
ATL_IMPL_THUNK(667)
ATL_IMPL_THUNK(668)
ATL_IMPL_THUNK(669)
ATL_IMPL_THUNK(670)
ATL_IMPL_THUNK(671)
ATL_IMPL_THUNK(672)
ATL_IMPL_THUNK(673)
ATL_IMPL_THUNK(674)
ATL_IMPL_THUNK(675)
ATL_IMPL_THUNK(676)
ATL_IMPL_THUNK(677)
ATL_IMPL_THUNK(678)
ATL_IMPL_THUNK(679)
ATL_IMPL_THUNK(680)
ATL_IMPL_THUNK(681)
ATL_IMPL_THUNK(682)
ATL_IMPL_THUNK(683)
ATL_IMPL_THUNK(684)
ATL_IMPL_THUNK(685)
ATL_IMPL_THUNK(686)
ATL_IMPL_THUNK(687)
ATL_IMPL_THUNK(688)
ATL_IMPL_THUNK(689)
ATL_IMPL_THUNK(690)
ATL_IMPL_THUNK(691)
ATL_IMPL_THUNK(692)
ATL_IMPL_THUNK(693)
ATL_IMPL_THUNK(694)
ATL_IMPL_THUNK(695)
ATL_IMPL_THUNK(696)
ATL_IMPL_THUNK(697)
ATL_IMPL_THUNK(698)
ATL_IMPL_THUNK(699)
ATL_IMPL_THUNK(700)
ATL_IMPL_THUNK(701)
ATL_IMPL_THUNK(702)
ATL_IMPL_THUNK(703)
ATL_IMPL_THUNK(704)
ATL_IMPL_THUNK(705)
ATL_IMPL_THUNK(706)
ATL_IMPL_THUNK(707)
ATL_IMPL_THUNK(708)
ATL_IMPL_THUNK(709)
ATL_IMPL_THUNK(710)
ATL_IMPL_THUNK(711)
ATL_IMPL_THUNK(712)
ATL_IMPL_THUNK(713)
ATL_IMPL_THUNK(714)
ATL_IMPL_THUNK(715)
ATL_IMPL_THUNK(716)
ATL_IMPL_THUNK(717)
ATL_IMPL_THUNK(718)
ATL_IMPL_THUNK(719)
ATL_IMPL_THUNK(720)
ATL_IMPL_THUNK(721)
ATL_IMPL_THUNK(722)
ATL_IMPL_THUNK(723)
ATL_IMPL_THUNK(724)
ATL_IMPL_THUNK(725)
ATL_IMPL_THUNK(726)
ATL_IMPL_THUNK(727)
ATL_IMPL_THUNK(728)
ATL_IMPL_THUNK(729)
ATL_IMPL_THUNK(730)
ATL_IMPL_THUNK(731)
ATL_IMPL_THUNK(732)
ATL_IMPL_THUNK(733)
ATL_IMPL_THUNK(734)
ATL_IMPL_THUNK(735)
ATL_IMPL_THUNK(736)
ATL_IMPL_THUNK(737)
ATL_IMPL_THUNK(738)
ATL_IMPL_THUNK(739)
ATL_IMPL_THUNK(740)
ATL_IMPL_THUNK(741)
ATL_IMPL_THUNK(742)
ATL_IMPL_THUNK(743)
ATL_IMPL_THUNK(744)
ATL_IMPL_THUNK(745)
ATL_IMPL_THUNK(746)
ATL_IMPL_THUNK(747)
ATL_IMPL_THUNK(748)
ATL_IMPL_THUNK(749)
ATL_IMPL_THUNK(750)
ATL_IMPL_THUNK(751)
ATL_IMPL_THUNK(752)
ATL_IMPL_THUNK(753)
ATL_IMPL_THUNK(754)
ATL_IMPL_THUNK(755)
ATL_IMPL_THUNK(756)
ATL_IMPL_THUNK(757)
ATL_IMPL_THUNK(758)
ATL_IMPL_THUNK(759)
ATL_IMPL_THUNK(760)
ATL_IMPL_THUNK(761)
ATL_IMPL_THUNK(762)
ATL_IMPL_THUNK(763)
ATL_IMPL_THUNK(764)
ATL_IMPL_THUNK(765)
ATL_IMPL_THUNK(766)
ATL_IMPL_THUNK(767)
ATL_IMPL_THUNK(768)
ATL_IMPL_THUNK(769)
ATL_IMPL_THUNK(770)
ATL_IMPL_THUNK(771)
ATL_IMPL_THUNK(772)
ATL_IMPL_THUNK(773)
ATL_IMPL_THUNK(774)
ATL_IMPL_THUNK(775)
ATL_IMPL_THUNK(776)
ATL_IMPL_THUNK(777)
ATL_IMPL_THUNK(778)
ATL_IMPL_THUNK(779)
ATL_IMPL_THUNK(780)
ATL_IMPL_THUNK(781)
ATL_IMPL_THUNK(782)
ATL_IMPL_THUNK(783)
ATL_IMPL_THUNK(784)
ATL_IMPL_THUNK(785)
ATL_IMPL_THUNK(786)
ATL_IMPL_THUNK(787)
ATL_IMPL_THUNK(788)
ATL_IMPL_THUNK(789)
ATL_IMPL_THUNK(790)
ATL_IMPL_THUNK(791)
ATL_IMPL_THUNK(792)
ATL_IMPL_THUNK(793)
ATL_IMPL_THUNK(794)
ATL_IMPL_THUNK(795)
ATL_IMPL_THUNK(796)
ATL_IMPL_THUNK(797)
ATL_IMPL_THUNK(798)
ATL_IMPL_THUNK(799)
ATL_IMPL_THUNK(800)
ATL_IMPL_THUNK(801)
ATL_IMPL_THUNK(802)
ATL_IMPL_THUNK(803)
ATL_IMPL_THUNK(804)
ATL_IMPL_THUNK(805)
ATL_IMPL_THUNK(806)
ATL_IMPL_THUNK(807)
ATL_IMPL_THUNK(808)
ATL_IMPL_THUNK(809)
ATL_IMPL_THUNK(810)
ATL_IMPL_THUNK(811)
ATL_IMPL_THUNK(812)
ATL_IMPL_THUNK(813)
ATL_IMPL_THUNK(814)
ATL_IMPL_THUNK(815)
ATL_IMPL_THUNK(816)
ATL_IMPL_THUNK(817)
ATL_IMPL_THUNK(818)
ATL_IMPL_THUNK(819)
ATL_IMPL_THUNK(820)
ATL_IMPL_THUNK(821)
ATL_IMPL_THUNK(822)
ATL_IMPL_THUNK(823)
ATL_IMPL_THUNK(824)
ATL_IMPL_THUNK(825)
ATL_IMPL_THUNK(826)
ATL_IMPL_THUNK(827)
ATL_IMPL_THUNK(828)
ATL_IMPL_THUNK(829)
ATL_IMPL_THUNK(830)
ATL_IMPL_THUNK(831)
ATL_IMPL_THUNK(832)
ATL_IMPL_THUNK(833)
ATL_IMPL_THUNK(834)
ATL_IMPL_THUNK(835)
ATL_IMPL_THUNK(836)
ATL_IMPL_THUNK(837)
ATL_IMPL_THUNK(838)
ATL_IMPL_THUNK(839)
ATL_IMPL_THUNK(840)
ATL_IMPL_THUNK(841)
ATL_IMPL_THUNK(842)
ATL_IMPL_THUNK(843)
ATL_IMPL_THUNK(844)
ATL_IMPL_THUNK(845)
ATL_IMPL_THUNK(846)
ATL_IMPL_THUNK(847)
ATL_IMPL_THUNK(848)
ATL_IMPL_THUNK(849)
ATL_IMPL_THUNK(850)
ATL_IMPL_THUNK(851)
ATL_IMPL_THUNK(852)
ATL_IMPL_THUNK(853)
ATL_IMPL_THUNK(854)
ATL_IMPL_THUNK(855)
ATL_IMPL_THUNK(856)
ATL_IMPL_THUNK(857)
ATL_IMPL_THUNK(858)
ATL_IMPL_THUNK(859)
ATL_IMPL_THUNK(860)
ATL_IMPL_THUNK(861)
ATL_IMPL_THUNK(862)
ATL_IMPL_THUNK(863)
ATL_IMPL_THUNK(864)
ATL_IMPL_THUNK(865)
ATL_IMPL_THUNK(866)
ATL_IMPL_THUNK(867)
ATL_IMPL_THUNK(868)
ATL_IMPL_THUNK(869)
ATL_IMPL_THUNK(870)
ATL_IMPL_THUNK(871)
ATL_IMPL_THUNK(872)
ATL_IMPL_THUNK(873)
ATL_IMPL_THUNK(874)
ATL_IMPL_THUNK(875)
ATL_IMPL_THUNK(876)
ATL_IMPL_THUNK(877)
ATL_IMPL_THUNK(878)
ATL_IMPL_THUNK(879)
ATL_IMPL_THUNK(880)
ATL_IMPL_THUNK(881)
ATL_IMPL_THUNK(882)
ATL_IMPL_THUNK(883)
ATL_IMPL_THUNK(884)
ATL_IMPL_THUNK(885)
ATL_IMPL_THUNK(886)
ATL_IMPL_THUNK(887)
ATL_IMPL_THUNK(888)
ATL_IMPL_THUNK(889)
ATL_IMPL_THUNK(890)
ATL_IMPL_THUNK(891)
ATL_IMPL_THUNK(892)
ATL_IMPL_THUNK(893)
ATL_IMPL_THUNK(894)
ATL_IMPL_THUNK(895)
ATL_IMPL_THUNK(896)
ATL_IMPL_THUNK(897)
ATL_IMPL_THUNK(898)
ATL_IMPL_THUNK(899)
ATL_IMPL_THUNK(900)
ATL_IMPL_THUNK(901)
ATL_IMPL_THUNK(902)
ATL_IMPL_THUNK(903)
ATL_IMPL_THUNK(904)
ATL_IMPL_THUNK(905)
ATL_IMPL_THUNK(906)
ATL_IMPL_THUNK(907)
ATL_IMPL_THUNK(908)
ATL_IMPL_THUNK(909)
ATL_IMPL_THUNK(910)
ATL_IMPL_THUNK(911)
ATL_IMPL_THUNK(912)
ATL_IMPL_THUNK(913)
ATL_IMPL_THUNK(914)
ATL_IMPL_THUNK(915)
ATL_IMPL_THUNK(916)
ATL_IMPL_THUNK(917)
ATL_IMPL_THUNK(918)
ATL_IMPL_THUNK(919)
ATL_IMPL_THUNK(920)
ATL_IMPL_THUNK(921)
ATL_IMPL_THUNK(922)
ATL_IMPL_THUNK(923)
ATL_IMPL_THUNK(924)
ATL_IMPL_THUNK(925)
ATL_IMPL_THUNK(926)
ATL_IMPL_THUNK(927)
ATL_IMPL_THUNK(928)
ATL_IMPL_THUNK(929)
ATL_IMPL_THUNK(930)
ATL_IMPL_THUNK(931)
ATL_IMPL_THUNK(932)
ATL_IMPL_THUNK(933)
ATL_IMPL_THUNK(934)
ATL_IMPL_THUNK(935)
ATL_IMPL_THUNK(936)
ATL_IMPL_THUNK(937)
ATL_IMPL_THUNK(938)
ATL_IMPL_THUNK(939)
ATL_IMPL_THUNK(940)
ATL_IMPL_THUNK(941)
ATL_IMPL_THUNK(942)
ATL_IMPL_THUNK(943)
ATL_IMPL_THUNK(944)
ATL_IMPL_THUNK(945)
ATL_IMPL_THUNK(946)
ATL_IMPL_THUNK(947)
ATL_IMPL_THUNK(948)
ATL_IMPL_THUNK(949)
ATL_IMPL_THUNK(950)
ATL_IMPL_THUNK(951)
ATL_IMPL_THUNK(952)
ATL_IMPL_THUNK(953)
ATL_IMPL_THUNK(954)
ATL_IMPL_THUNK(955)
ATL_IMPL_THUNK(956)
ATL_IMPL_THUNK(957)
ATL_IMPL_THUNK(958)
ATL_IMPL_THUNK(959)
ATL_IMPL_THUNK(960)
ATL_IMPL_THUNK(961)
ATL_IMPL_THUNK(962)
ATL_IMPL_THUNK(963)
ATL_IMPL_THUNK(964)
ATL_IMPL_THUNK(965)
ATL_IMPL_THUNK(966)
ATL_IMPL_THUNK(967)
ATL_IMPL_THUNK(968)
ATL_IMPL_THUNK(969)
ATL_IMPL_THUNK(970)
ATL_IMPL_THUNK(971)
ATL_IMPL_THUNK(972)
ATL_IMPL_THUNK(973)
ATL_IMPL_THUNK(974)
ATL_IMPL_THUNK(975)
ATL_IMPL_THUNK(976)
ATL_IMPL_THUNK(977)
ATL_IMPL_THUNK(978)
ATL_IMPL_THUNK(979)
ATL_IMPL_THUNK(980)
ATL_IMPL_THUNK(981)
ATL_IMPL_THUNK(982)
ATL_IMPL_THUNK(983)
ATL_IMPL_THUNK(984)
ATL_IMPL_THUNK(985)
ATL_IMPL_THUNK(986)
ATL_IMPL_THUNK(987)
ATL_IMPL_THUNK(988)
ATL_IMPL_THUNK(989)
ATL_IMPL_THUNK(990)
ATL_IMPL_THUNK(991)
ATL_IMPL_THUNK(992)
ATL_IMPL_THUNK(993)
ATL_IMPL_THUNK(994)
ATL_IMPL_THUNK(995)
ATL_IMPL_THUNK(996)
ATL_IMPL_THUNK(997)
ATL_IMPL_THUNK(998)
ATL_IMPL_THUNK(999)
ATL_IMPL_THUNK(1000)
ATL_IMPL_THUNK(1001)
ATL_IMPL_THUNK(1002)
ATL_IMPL_THUNK(1003)
ATL_IMPL_THUNK(1004)
ATL_IMPL_THUNK(1005)
ATL_IMPL_THUNK(1006)
ATL_IMPL_THUNK(1007)
ATL_IMPL_THUNK(1008)
ATL_IMPL_THUNK(1009)
ATL_IMPL_THUNK(1010)
ATL_IMPL_THUNK(1011)
ATL_IMPL_THUNK(1012)
ATL_IMPL_THUNK(1013)
ATL_IMPL_THUNK(1014)
ATL_IMPL_THUNK(1015)
ATL_IMPL_THUNK(1016)
ATL_IMPL_THUNK(1017)
ATL_IMPL_THUNK(1018)
ATL_IMPL_THUNK(1019)
ATL_IMPL_THUNK(1020)
ATL_IMPL_THUNK(1021)
ATL_IMPL_THUNK(1022)
ATL_IMPL_THUNK(1023)

#endif	// _M_IX86

};  // namespace ATL
