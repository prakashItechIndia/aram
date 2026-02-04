import svgPaths from "./svg-0p4ahpj19p";
import imgSubtract from "figma:asset/aa57c4fa5b9e0215bd429e2bd5bcca5d6fda9db3.png";
import imgImage from "figma:asset/f98bae3d842bb5fa9417e32c9c2e99ac90727028.png";

function Navigation() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Navigation">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Navigation">
          <path d={svgPaths.p3b24737a} fill="var(--fill-0, white)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Container">
      <Navigation />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-center justify-center p-[6px] relative rounded-[4px] shrink-0" data-name="Button">
      <Container />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Button />
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex items-center justify-end p-[10px] relative shrink-0" data-name="Header">
      <Frame12 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[0_4.91%_42.03%_0]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 92.9884 16.231">
        <g id="Group">
          <path d={svgPaths.p24f7ee00} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.pf971300} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p3f43b200} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.p1b3b780} fill="var(--fill-0, white)" id="Vector_4" />
          <path d={svgPaths.p1480ac00} fill="var(--fill-0, #FF7272)" id="Vector_5" />
          <path d={svgPaths.paf2d400} fill="var(--fill-0, white)" id="Vector_6" />
          <path d={svgPaths.pf108600} fill="var(--fill-0, white)" id="Vector_7" />
          <path d={svgPaths.p7c13400} fill="var(--fill-0, #FF7272)" id="Vector_8" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[67.26%_4.91%_0_39.53%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54.3301 9.16658">
        <g id="Group">
          <path d={svgPaths.p142ea000} fill="var(--fill-0, #FF7272)" id="Vector" />
          <path d={svgPaths.p24c9a00} fill="var(--fill-0, #FF7272)" id="Vector_2" />
          <path d={svgPaths.pb9d0f00} fill="var(--fill-0, #FF7272)" id="Vector_3" />
          <path d={svgPaths.p32a73a00} fill="var(--fill-0, #FF7272)" id="Vector_4" />
          <path d={svgPaths.pb84c500} fill="var(--fill-0, #FF7272)" id="Vector_5" />
          <path d={svgPaths.p13c32c40} fill="var(--fill-0, #FF7272)" id="Vector_6" />
          <path d={svgPaths.p2aac6c0} fill="var(--fill-0, #FF7272)" id="Vector_7" />
          <path d={svgPaths.pb48d920} fill="var(--fill-0, #FF7272)" id="Vector_8" />
          <path d={svgPaths.p265f2d00} fill="var(--fill-0, #FF7272)" id="Vector_9" />
          <path d={svgPaths.p21931780} fill="var(--fill-0, #FF7272)" id="Vector_10" />
          <path d={svgPaths.p209a5830} fill="var(--fill-0, #FF7272)" id="Vector_11" />
          <path d={svgPaths.p2944b400} fill="var(--fill-0, #FF7272)" id="Vector_12" />
          <path d={svgPaths.p2719f900} fill="var(--fill-0, #FF7272)" id="Vector_13" />
          <path d={svgPaths.p1a79e500} fill="var(--fill-0, #FF7272)" id="Vector_14" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[0.08%_0_84.81%_95.7%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.20516 4.23063">
        <g id="Group">
          <path d={svgPaths.p3bca000} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p1a7ef700} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <div className="h-[28px] overflow-clip relative shrink-0 w-[97.791px]" data-name="Logo">
      <Group />
      <Group1 />
      <Group2 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[10px] py-0 relative size-full">
          <Logo />
        </div>
      </div>
    </div>
  );
}

function WeatherMoon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Weather Moon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Weather Moon">
          <path d={svgPaths.p325f7d00} fill="var(--fill-0, white)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Container">
      <WeatherMoon />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-center justify-center p-[6px] relative rounded-[4px] shrink-0" data-name="Button">
      <Container1 />
    </div>
  );
}

function AlertBadge() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Alert Badge">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Alert Badge">
          <path d={svgPaths.p1c77c780} fill="var(--fill-0, white)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Container">
      <AlertBadge />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-center justify-center p-[6px] relative rounded-[4px] shrink-0" data-name="Button">
      <Container2 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Button1 />
      <Button2 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame13 />
    </div>
  );
}

function Header1() {
  return (
    <div className="content-stretch flex items-center justify-end pl-[20px] pr-[12px] py-[10px] relative shrink-0" data-name="Header">
      <Frame9 />
    </div>
  );
}

function ToggleMultiple() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Toggle Multiple">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Toggle Multiple">
          <path d={svgPaths.p33631ff0} fill="var(--fill-0, white)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col items-start not-italic relative shrink-0 text-white">
      <p className="css-ew64yg font-['Inter:Semibold',sans-serif] leading-[16px] relative shrink-0 text-[12px]">IQAC</p>
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[10px]">Admin</p>
    </div>
  );
}

function Chevron() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Chevron">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Chevron">
          <path d={svgPaths.p6f97b80} fill="var(--fill-0, white)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
      <Frame3 />
      <Chevron />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
      <ToggleMultiple />
      <Frame23 />
    </div>
  );
}

function MainNavigation() {
  return (
    <div className="content-stretch flex flex-col h-full items-center justify-center px-[12px] py-[8px] relative shrink-0" data-name="Main Navigation">
      <div aria-hidden="true" className="absolute border-[#8ca5df] border-l border-solid inset-0 pointer-events-none" />
      <Frame15 />
    </div>
  );
}

function Avatar() {
  return (
    <div className="absolute left-[calc(50%+0.5px)] size-[28px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Avatar">
      <div className="absolute left-0 size-[28px] top-0" data-name="Subtract">
        <img alt="" className="block max-w-none size-full" height="28" src={imgSubtract} width="28" />
      </div>
    </div>
  );
}

function MainNavigation1() {
  return (
    <div className="h-full relative shrink-0 w-[53px]" data-name="Main Navigation">
      <div aria-hidden="true" className="absolute border-[#8ca5df] border-l border-solid inset-0 pointer-events-none" />
      <Avatar />
    </div>
  );
}

function MainNavigation2() {
  return (
    <div className="h-full relative shrink-0 w-[53px]" data-name="Main Navigation">
      <div aria-hidden="true" className="absolute border-[#8ca5df] border-l border-solid inset-0 pointer-events-none" />
      <div className="absolute left-[calc(50%+0.5px)] rounded-[39px] size-[28px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="image">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[39px]">
          <img alt="" className="absolute left-[-14.75%] max-w-none size-[422.87%] top-[-175.94%]" src={imgImage} />
        </div>
      </div>
    </div>
  );
}

function Header2() {
  return (
    <div className="absolute content-stretch flex h-[52px] items-center right-0 top-0 w-[1280px]" data-name="Header" style={{ backgroundImage: "linear-gradient(181.911deg, rgb(36, 83, 195) 26.985%, rgb(8, 55, 164) 72.41%), linear-gradient(181.911deg, rgb(71, 96, 213) 26.985%, rgb(0, 39, 180) 72.41%)" }}>
      <Header />
      <Frame24 />
      <Header1 />
      <MainNavigation />
      <MainNavigation1 />
      <MainNavigation2 />
    </div>
  );
}

function Home() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Home">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Home">
          <path d={svgPaths.p3451d600} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center p-[8px] relative rounded-[8px] shrink-0 w-[44px]">
      <Home />
      <div className="css-g0mm18 flex flex-col font-['Segoe_UI:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#616161] text-[6px]">
        <p className="css-ew64yg leading-[14px]">Dashboard</p>
      </div>
    </div>
  );
}

function MainItem() {
  return (
    <div className="relative shrink-0 w-full" data-name="Main Item">
      <div className="flex flex-col items-center justify-end size-full">
        <div className="content-stretch flex flex-col gap-[6px] items-center justify-end px-[8px] py-[6px] relative w-full">
          <Frame30 />
        </div>
      </div>
    </div>
  );
}

function WrenchSettings() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Wrench Settings">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Wrench Settings">
          <path d={svgPaths.p55f6680} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center p-[8px] relative rounded-[8px] shrink-0 w-[44px]">
      <WrenchSettings />
      <div className="css-g0mm18 flex flex-col font-['Segoe_UI:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#616161] text-[6px]">
        <p className="css-ew64yg leading-[14px]">Setup</p>
      </div>
    </div>
  );
}

function MainItem1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Main Item">
      <div className="flex flex-col items-center justify-end size-full">
        <div className="content-stretch flex flex-col gap-[6px] items-center justify-end px-[8px] py-[6px] relative w-full">
          <Frame31 />
        </div>
      </div>
    </div>
  );
}

function Briefcase() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Briefcase">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Briefcase">
          <path d={svgPaths.p1e58cb00} fill="var(--fill-0, #2453C3)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Frame32() {
  return (
    <div className="bg-[#eaf0fb] content-stretch flex flex-col gap-[4px] items-center justify-center p-[8px] relative rounded-[8px] shrink-0 w-[44px]">
      <Briefcase />
      <div className="css-g0mm18 flex flex-col font-['Segoe_UI:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#2453c3] text-[6px]">
        <p className="css-ew64yg leading-[14px]">Tasks</p>
      </div>
      <div className="absolute bg-[#2453c3] h-[16px] left-0 rounded-[8px] top-[14px] w-[2px]" />
    </div>
  );
}

function MainItem2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Main Item">
      <div className="flex flex-col items-center justify-end size-full">
        <div className="content-stretch flex flex-col gap-[6px] items-center justify-end px-[8px] py-[6px] relative w-full">
          <Frame32 />
        </div>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col items-start px-0 py-[16px] relative shrink-0 w-full">
      <MainItem />
      <MainItem1 />
      <MainItem2 />
    </div>
  );
}

function ChatHelp() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Chat Help">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Chat Help">
          <path d={svgPaths.p1561180} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center p-[8px] relative rounded-[8px] shrink-0 w-[44px]">
      <ChatHelp />
      <div className="css-g0mm18 flex flex-col font-['Segoe_UI:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#616161] text-[6px]">
        <p className="css-ew64yg leading-[14px]">Help</p>
      </div>
    </div>
  );
}

function MainItem3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Main Item">
      <div className="flex flex-col items-center justify-end size-full">
        <div className="content-stretch flex flex-col gap-[6px] items-center justify-end px-[8px] py-[6px] relative w-full">
          <Frame33 />
        </div>
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Settings">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Settings">
          <path d={svgPaths.p204bc240} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center p-[8px] relative rounded-[8px] shrink-0 w-[44px]">
      <Settings />
      <div className="css-g0mm18 flex flex-col font-['Segoe_UI:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#616161] text-[6px]">
        <p className="css-ew64yg leading-[14px]">Settings</p>
      </div>
    </div>
  );
}

function MainItem4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Main Item">
      <div className="flex flex-col items-center justify-end size-full">
        <div className="content-stretch flex flex-col gap-[6px] items-center justify-end px-[8px] py-[6px] relative w-full">
          <Frame34 />
        </div>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col items-start px-0 py-[10px] relative shrink-0 w-full">
      <MainItem3 />
      <MainItem4 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col h-[668px] items-start justify-between relative shrink-0 w-full">
      <Frame16 />
      <Frame19 />
    </div>
  );
}

function MainMenuIqac() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[668px] items-start relative shrink-0 w-[52px]" data-name="Main Menu IQAC">
      <div aria-hidden="true" className="absolute border-[#e0e0e0] border-r border-solid inset-0 pointer-events-none" />
      <Frame17 />
    </div>
  );
}

function Briefcase1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Briefcase">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Briefcase">
          <path d={svgPaths.p289c2a80} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <Briefcase1 />
      <p className="css-ew64yg font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#242424] text-[13px]">Tasks</p>
    </div>
  );
}

function ListRtl() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="List RTL">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="List RTL">
          <path d={svgPaths.p29d8e000} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function MainNavigation3() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Main Navigation">
      <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-r border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[10px] relative w-full">
          <Frame18 />
          <ListRtl />
        </div>
      </div>
    </div>
  );
}

function IconEnd1Medium() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon End 1 medium">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon End 1 medium">
          <path d={svgPaths.p6f97b80} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full">
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Semibold',sans-serif] h-[16px] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#242424] text-[12px]">
        <p className="css-4hzbpn leading-[16px]">AY 2025 - 2026</p>
      </div>
      <IconEnd1Medium />
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-h-px min-w-px relative">
      <div className="css-g0mm18 flex flex-col font-['Segoe_UI:Semibold',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#2453c3] text-[8px] text-ellipsis uppercase w-full">
        <p className="css-g0mm18 leading-[14px] overflow-hidden">Current</p>
      </div>
      <Frame39 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex items-start px-[12px] py-0 relative w-full">
        <Frame37 />
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start overflow-clip px-0 py-[12px] relative rounded-[inherit] size-full">
        <Frame38 />
      </div>
      <div aria-hidden="true" className="absolute border-[#d0dbf6] border-b border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function MainNavigation4() {
  return (
    <div className="content-stretch flex flex-col h-[52px] items-start relative shrink-0 w-full" data-name="Main Navigation" style={{ backgroundImage: "linear-gradient(192.056deg, rgb(255, 255, 255) 26.985%, rgb(234, 240, 251) 72.41%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <div aria-hidden="true" className="absolute border-[#e0e0e0] border-r border-solid inset-0 pointer-events-none" />
      <Frame36 />
    </div>
  );
}

function Search() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Search">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Search">
          <path d={svgPaths.pd965600} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Text">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start pb-[7px] pt-[5px] px-[2px] relative w-full">
          <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#707070] text-[13px]">Search</p>
        </div>
      </div>
    </div>
  );
}

function IconTextStack() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Icon-Text-stack">
      <Search />
      <Text />
    </div>
  );
}

function Contents() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Contents">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-0 relative w-full">
          <IconTextStack />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d1d1d1] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Input() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[4px] shrink-0 w-full" data-name="Input">
      <Contents />
    </div>
  );
}

function CalendarAdd() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Calendar Add">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Calendar Add">
          <path d={svgPaths.p20d19900} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function ContentFrame() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip px-[2px] py-0 relative shrink-0" data-name="content-frame">
      <CalendarAdd />
      <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#616161] text-[13px]">
        <p className="css-ew64yg leading-[20px]">Calendar</p>
      </div>
    </div>
  );
}

function MenuItem() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Menu Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative w-full">
          <ContentFrame />
        </div>
      </div>
    </div>
  );
}

function People() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="People">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="People">
          <path d={svgPaths.p3a368700} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function ContentFrame1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip px-[2px] py-0 relative shrink-0" data-name="content-frame">
      <People />
      <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#616161] text-[13px]">
        <p className="css-ew64yg leading-[20px]">Committee</p>
      </div>
    </div>
  );
}

function MenuItem1() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Menu Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative w-full">
          <ContentFrame1 />
        </div>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path d={svgPaths.p6239971} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function ContentFrame2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip px-[2px] py-0 relative shrink-0" data-name="content-frame">
      <Group3 />
      <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#616161] text-[13px]">
        <p className="css-ew64yg leading-[20px]">Co-Ordinator</p>
      </div>
    </div>
  );
}

function MenuItem2() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Menu Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative w-full">
          <ContentFrame2 />
        </div>
      </div>
    </div>
  );
}

function WindowBulletList() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Window Bullet List">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Window Bullet List">
          <path d={svgPaths.p3b29fc00} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function ContentFrame3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip px-[2px] py-0 relative shrink-0" data-name="content-frame">
      <WindowBulletList />
      <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#2453c3] text-[13px]">
        <p className="css-ew64yg leading-[20px]">Events</p>
      </div>
    </div>
  );
}

function MenuItem3() {
  return (
    <div className="bg-[#eaf0fb] relative rounded-[4px] shrink-0 w-full" data-name="Menu Item">
      <div className="content-stretch flex gap-[4px] items-start px-[8px] py-[4px] relative w-full">
        <ContentFrame3 />
      </div>
    </div>
  );
}

function ClipboardSearch() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Clipboard Search">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Clipboard Search">
          <path d={svgPaths.p1fd00400} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function ContentFrame4() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip px-[2px] py-0 relative shrink-0" data-name="content-frame">
      <ClipboardSearch />
      <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#616161] text-[13px]">
        <p className="css-ew64yg leading-[20px]">Audit Cycle</p>
      </div>
    </div>
  );
}

function MenuItem4() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Menu Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative w-full">
          <ContentFrame4 />
        </div>
      </div>
    </div>
  );
}

function SquareTextArrowRepeatAll() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Square Text Arrow Repeat All">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Square Text Arrow Repeat All">
          <path d={svgPaths.p14698500} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function ContentFrame5() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip px-[2px] py-0 relative shrink-0" data-name="content-frame">
      <SquareTextArrowRepeatAll />
      <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#616161] text-[13px]">
        <p className="css-ew64yg leading-[20px]">Change Request</p>
      </div>
    </div>
  );
}

function MenuItem5() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Menu Item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative w-full">
          <ContentFrame5 />
        </div>
      </div>
    </div>
  );
}

function Navigation1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative w-full" data-name="Navigation">
      <MenuItem />
      <MenuItem1 />
      <MenuItem2 />
      <MenuItem3 />
      <MenuItem4 />
      <MenuItem5 />
    </div>
  );
}

function MainNavigation5() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Main Navigation">
      <div aria-hidden="true" className="absolute border-[#e0e0e0] border-r border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[12px] relative size-full">
        <Input />
        <Navigation1 />
      </div>
    </div>
  );
}

function MenuWithAySelection() {
  return (
    <div className="content-stretch flex flex-col h-[668px] items-start relative shrink-0 w-[200px]" data-name="Menu with AY selection">
      <MainNavigation3 />
      <MainNavigation4 />
      <MainNavigation5 />
    </div>
  );
}

function TextWrapperForOffset() {
  return (
    <div className="content-stretch flex h-[20px] items-start pb-[3px] pt-px px-0 relative shrink-0" data-name="Text wrapper for offset">
      <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#424242] text-[12px]">
        <p className="css-ew64yg leading-[16px]">Task</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex gap-[4px] h-[20px] items-center justify-center relative shrink-0" data-name="Container">
      <TextWrapperForOffset />
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex gap-[6px] items-center justify-center px-[8px] py-0 relative rounded-[4px] shrink-0" data-name="Button">
      <Container3 />
    </div>
  );
}

function Chevron1() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Chevron">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Chevron">
          <path d={svgPaths.p3244c1f8} fill="var(--fill-0, #424242)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Divider() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Divider">
      <Chevron1 />
    </div>
  );
}

function BreadcrumbItem() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name=".Breadcrumb Item">
      <Button3 />
      <Divider />
    </div>
  );
}

function TextWrapperForOffset1() {
  return (
    <div className="content-stretch flex h-[20px] items-start pb-[3px] pt-px px-0 relative shrink-0" data-name="Text wrapper for offset">
      <div className="css-g0mm18 flex flex-col font-['Inter:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#424242] text-[12px]">
        <p className="css-ew64yg leading-[16px]">Events</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[4px] h-[20px] items-center justify-center relative shrink-0" data-name="Container">
      <TextWrapperForOffset1 />
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex gap-[6px] items-center justify-center px-[8px] py-0 relative rounded-[4px] shrink-0" data-name="Button">
      <Container4 />
    </div>
  );
}

function BreadcrumbItem1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name=".Breadcrumb Item">
      <Button4 />
    </div>
  );
}

function Breadcrumb() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Breadcrumb">
      <BreadcrumbItem />
      <BreadcrumbItem1 />
    </div>
  );
}

function Frame42() {
  return (
    <div className="bg-[#f0f0f0] content-stretch flex flex-col items-start px-[16px] py-[10px] relative shrink-0 w-[1028px]">
      <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
      <Breadcrumb />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <p className="css-ew64yg font-['Inter:Semibold',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#242424] text-[16px]">Events List</p>
    </div>
  );
}

function Search1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Search">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Search">
          <path d={svgPaths.p2fc61600} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Text">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start pb-[7px] pt-[5px] px-[2px] relative w-full">
          <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#707070] text-[13px]">{`Search by name `}</p>
        </div>
      </div>
    </div>
  );
}

function IconTextStack1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Icon-Text-stack">
      <Search1 />
      <Text1 />
    </div>
  );
}

function Contents1() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-[280px]" data-name="Contents">
      <div className="content-stretch flex gap-[10px] items-center overflow-clip px-[10px] py-0 relative rounded-[inherit] w-full">
        <IconTextStack1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d1d1d1] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Input1() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[4px] shrink-0" data-name="Input">
      <Contents1 />
      <div className="absolute bg-[#616161] bottom-0 h-px left-0 opacity-0 right-0 rounded-[4px]" data-name="Thin underline" />
    </div>
  );
}

function Filter() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Filter">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Filter">
          <path d={svgPaths.p3af20100} fill="var(--fill-0, #242424)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Container">
      <Filter />
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center p-[6px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d1d1d1] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container5 />
    </div>
  );
}

function MoreHorizontal() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="More Horizontal">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="More Horizontal">
          <path d={svgPaths.p167dfbf2} fill="var(--fill-0, #242424)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Container">
      <MoreHorizontal />
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center p-[6px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d1d1d1] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container6 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Button5 />
      <Button6 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0">
      <Frame20 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Input1 />
      <Frame21 />
    </div>
  );
}

function ArrowSort() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Arrow Sort">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Arrow Sort">
          <path d={svgPaths.pcdf2500} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function StableTableCell() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-col font-['Inter:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#424242] text-[12px]">
        <p className="css-ew64yg leading-[16px]">Code</p>
      </div>
      <ArrowSort />
    </div>
  );
}

function StableTableGrid() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[120px]" data-name="Stable Table/ Grid">
      <StableTableCell />
    </div>
  );
}

function ArrowSort1() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Arrow Sort">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Arrow Sort">
          <path d={svgPaths.pcdf2500} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function StableTableCell1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-col font-['Inter:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#424242] text-[12px]">
        <p className="css-ew64yg leading-[16px]">Event Name</p>
      </div>
      <ArrowSort1 />
    </div>
  );
}

function StableTableGrid1() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[299px]" data-name="Stable Table/ Grid">
      <StableTableCell1 />
    </div>
  );
}

function ArrowSort2() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Arrow Sort">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Arrow Sort">
          <path d={svgPaths.pcdf2500} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function StableTableCell2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-col font-['Inter:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#424242] text-[12px]">
        <p className="css-ew64yg leading-[16px]">Type</p>
      </div>
      <ArrowSort2 />
    </div>
  );
}

function StableTableGrid2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-h-px min-w-px relative" data-name="Stable Table/ Grid">
      <StableTableCell2 />
    </div>
  );
}

function ArrowSort3() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Arrow Sort">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Arrow Sort">
          <path d={svgPaths.pcdf2500} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function StableTableCell3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-col font-['Inter:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#424242] text-[12px]">
        <p className="css-ew64yg leading-[16px]">Start Date</p>
      </div>
      <ArrowSort3 />
    </div>
  );
}

function StableTableGrid3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-h-px min-w-px relative" data-name="Stable Table/ Grid">
      <StableTableCell3 />
    </div>
  );
}

function ArrowSort4() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Arrow Sort">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Arrow Sort">
          <path d={svgPaths.pcdf2500} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function StableTableCell4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-col font-['Inter:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#424242] text-[12px]">
        <p className="css-ew64yg leading-[16px]">Status</p>
      </div>
      <ArrowSort4 />
    </div>
  );
}

function StableTableGrid4() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[123px]" data-name="Stable Table/ Grid">
      <StableTableCell4 />
    </div>
  );
}

function MoreHorizontal1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="More Horizontal">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="More Horizontal">
          <path d={svgPaths.p167dfbf2} fill="var(--fill-0, #242424)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center opacity-0 relative shrink-0" data-name="Container">
      <MoreHorizontal1 />
    </div>
  );
}

function StableTableRow() {
  return (
    <div className="bg-[#fafafa] h-[36px] relative shrink-0 w-full" data-name="Stable Table/ Row">
      <div aria-hidden="true" className="absolute border border-[#f0f0f0] border-solid inset-[-1px] pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[20px] items-center px-[20px] py-0 relative size-full">
          <StableTableGrid />
          <StableTableGrid1 />
          <StableTableGrid2 />
          <StableTableGrid3 />
          <StableTableGrid4 />
          <Container7 />
        </div>
      </div>
    </div>
  );
}

function StableTableCell5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">20ESCS101</p>
      </div>
    </div>
  );
}

function StableTableGrid5() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[120px]" data-name="Stable Table/ Grid">
      <StableTableCell5 />
    </div>
  );
}

function StableTableCell6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">DevSprint 2025</p>
      </div>
    </div>
  );
}

function StableTableGrid6() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[299px]" data-name="Stable Table/ Grid">
      <StableTableCell6 />
    </div>
  );
}

function StableTableCell7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">Boot Camp</p>
      </div>
    </div>
  );
}

function StableTableGrid7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-h-px min-w-px relative" data-name="Stable Table/ Grid">
      <StableTableCell7 />
    </div>
  );
}

function StableTableCell8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">10/06/2025</p>
      </div>
    </div>
  );
}

function StableTableGrid8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-h-px min-w-px relative" data-name="Stable Table/ Grid">
      <StableTableCell8 />
    </div>
  );
}

function CircleSmall() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Circle Small">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2_9597)" id="Circle Small">
          <path d={svgPaths.p2bf13170} fill="var(--fill-0, #0A3FBC)" id="Shape" />
        </g>
        <defs>
          <clipPath id="clip0_2_9597">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon">
      <CircleSmall />
    </div>
  );
}

function TextOffset() {
  return (
    <div className="content-stretch flex flex-col h-[14px] items-start justify-center px-[2px] py-0 relative shrink-0" data-name="Text offset">
      <div className="css-g0mm18 flex flex-col font-['Inter:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0a3fbc] text-[10px] text-center">
        <p className="css-ew64yg leading-[14px]">New</p>
      </div>
    </div>
  );
}

function Chevron2() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Chevron">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Chevron">
          <path d={svgPaths.pf4077f0} fill="var(--fill-0, #0A3FBC)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Icon1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon">
      <Chevron2 />
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-[#eaf0fb] h-[20px] min-w-[20px] relative rounded-[9999px] shrink-0" data-name="Badge">
      <div className="content-stretch flex h-full items-center justify-center min-w-[inherit] overflow-clip px-[6px] py-0 relative rounded-[inherit]">
        <Icon />
        <TextOffset />
        <Icon1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0dbf6] border-solid inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function StableTableCell9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <Badge />
    </div>
  );
}

function StableTableGrid9() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[123px]" data-name="Stable Table/ Grid">
      <StableTableCell9 />
    </div>
  );
}

function MoreHorizontal2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="More Horizontal">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="More Horizontal">
          <path d={svgPaths.p167dfbf2} fill="var(--fill-0, #242424)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Container">
      <MoreHorizontal2 />
    </div>
  );
}

function StableTableRow1() {
  return (
    <div className="bg-white h-[44px] relative shrink-0 w-full" data-name="Stable Table/ Row">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[20px] items-center px-[20px] py-0 relative size-full">
          <StableTableGrid5 />
          <StableTableGrid6 />
          <StableTableGrid7 />
          <StableTableGrid8 />
          <StableTableGrid9 />
          <Container8 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f0f0f0] border-solid inset-[-1px] pointer-events-none" />
    </div>
  );
}

function StableTableCell10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">20ESCS201</p>
      </div>
    </div>
  );
}

function StableTableGrid10() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[120px]" data-name="Stable Table/ Grid">
      <StableTableCell10 />
    </div>
  );
}

function StableTableCell11() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">Hack-o-Heist Hackathon</p>
      </div>
    </div>
  );
}

function StableTableGrid11() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[299px]" data-name="Stable Table/ Grid">
      <StableTableCell11 />
    </div>
  );
}

function StableTableCell12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">Boot Camp</p>
      </div>
    </div>
  );
}

function StableTableGrid12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-h-px min-w-px relative" data-name="Stable Table/ Grid">
      <StableTableCell12 />
    </div>
  );
}

function StableTableCell13() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">10/06/2025</p>
      </div>
    </div>
  );
}

function StableTableGrid13() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-h-px min-w-px relative" data-name="Stable Table/ Grid">
      <StableTableCell13 />
    </div>
  );
}

function CircleSmall1() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Circle Small">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2_9597)" id="Circle Small">
          <path d={svgPaths.p2bf13170} fill="var(--fill-0, #0A3FBC)" id="Shape" />
        </g>
        <defs>
          <clipPath id="clip0_2_9597">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Icon2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon">
      <CircleSmall1 />
    </div>
  );
}

function TextOffset1() {
  return (
    <div className="content-stretch flex flex-col h-[14px] items-start justify-center px-[2px] py-0 relative shrink-0" data-name="Text offset">
      <div className="css-g0mm18 flex flex-col font-['Inter:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0a3fbc] text-[10px] text-center">
        <p className="css-ew64yg leading-[14px]">New</p>
      </div>
    </div>
  );
}

function Chevron3() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Chevron">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Chevron">
          <path d={svgPaths.pf4077f0} fill="var(--fill-0, #0A3FBC)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Icon3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon">
      <Chevron3 />
    </div>
  );
}

function Badge1() {
  return (
    <div className="bg-[#eaf0fb] h-[20px] min-w-[20px] relative rounded-[9999px] shrink-0" data-name="Badge">
      <div className="content-stretch flex h-full items-center justify-center min-w-[inherit] overflow-clip px-[6px] py-0 relative rounded-[inherit]">
        <Icon2 />
        <TextOffset1 />
        <Icon3 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0dbf6] border-solid inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function StableTableCell14() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <Badge1 />
    </div>
  );
}

function StableTableGrid14() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[123px]" data-name="Stable Table/ Grid">
      <StableTableCell14 />
    </div>
  );
}

function MoreHorizontal3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="More Horizontal">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="More Horizontal">
          <path d={svgPaths.p167dfbf2} fill="var(--fill-0, #242424)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Container">
      <MoreHorizontal3 />
    </div>
  );
}

function StableTableRow2() {
  return (
    <div className="bg-white h-[44px] relative shrink-0 w-full" data-name="Stable Table/ Row">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[20px] items-center px-[20px] py-0 relative size-full">
          <StableTableGrid10 />
          <StableTableGrid11 />
          <StableTableGrid12 />
          <StableTableGrid13 />
          <StableTableGrid14 />
          <Container9 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f0f0f0] border-solid inset-[-1px] pointer-events-none" />
    </div>
  );
}

function StableTableCell15() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">20ESCS102</p>
      </div>
    </div>
  );
}

function StableTableGrid15() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[120px]" data-name="Stable Table/ Grid">
      <StableTableCell15 />
    </div>
  );
}

function StableTableCell16() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">TechnoQuiz</p>
      </div>
    </div>
  );
}

function StableTableGrid16() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[299px]" data-name="Stable Table/ Grid">
      <StableTableCell16 />
    </div>
  );
}

function StableTableCell17() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">Boot Camp</p>
      </div>
    </div>
  );
}

function StableTableGrid17() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-h-px min-w-px relative" data-name="Stable Table/ Grid">
      <StableTableCell17 />
    </div>
  );
}

function StableTableCell18() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">01/06/2025</p>
      </div>
    </div>
  );
}

function StableTableGrid18() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-h-px min-w-px relative" data-name="Stable Table/ Grid">
      <StableTableCell18 />
    </div>
  );
}

function CircleSmall2() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Circle Small">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2_9592)" id="Circle Small">
          <path d={svgPaths.p2bf13170} fill="var(--fill-0, #0E700E)" id="Shape" />
        </g>
        <defs>
          <clipPath id="clip0_2_9592">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Icon4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon">
      <CircleSmall2 />
    </div>
  );
}

function TextOffset2() {
  return (
    <div className="content-stretch flex flex-col h-[14px] items-start justify-center px-[2px] py-0 relative shrink-0" data-name="Text offset">
      <div className="css-g0mm18 flex flex-col font-['Inter:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0e700e] text-[10px] text-center">
        <p className="css-ew64yg leading-[14px]">Approved</p>
      </div>
    </div>
  );
}

function Badge2() {
  return (
    <div className="bg-[#f1faf1] h-[20px] min-w-[20px] relative rounded-[9999px] shrink-0" data-name="Badge">
      <div className="content-stretch flex h-full items-center justify-center min-w-[inherit] overflow-clip px-[6px] py-0 relative rounded-[inherit]">
        <Icon4 />
        <TextOffset2 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#9fd89f] border-solid inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function StableTableCell19() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <Badge2 />
    </div>
  );
}

function StableTableGrid19() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[123px]" data-name="Stable Table/ Grid">
      <StableTableCell19 />
    </div>
  );
}

function MoreHorizontal4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="More Horizontal">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="More Horizontal">
          <path d={svgPaths.p167dfbf2} fill="var(--fill-0, #242424)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Container">
      <MoreHorizontal4 />
    </div>
  );
}

function StableTableRow3() {
  return (
    <div className="bg-white h-[44px] relative shrink-0 w-full" data-name="Stable Table/ Row">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[20px] items-center px-[20px] py-0 relative size-full">
          <StableTableGrid15 />
          <StableTableGrid16 />
          <StableTableGrid17 />
          <StableTableGrid18 />
          <StableTableGrid19 />
          <Container10 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f0f0f0] border-solid inset-[-1px] pointer-events-none" />
    </div>
  );
}

function StableTableCell20() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">20ESCS102</p>
      </div>
    </div>
  );
}

function StableTableGrid20() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[120px]" data-name="Stable Table/ Grid">
      <StableTableCell20 />
    </div>
  );
}

function StableTableCell21() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">TechnoQuiz</p>
      </div>
    </div>
  );
}

function StableTableGrid21() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[299px]" data-name="Stable Table/ Grid">
      <StableTableCell21 />
    </div>
  );
}

function StableTableCell22() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">Boot Camp</p>
      </div>
    </div>
  );
}

function StableTableGrid22() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-h-px min-w-px relative" data-name="Stable Table/ Grid">
      <StableTableCell22 />
    </div>
  );
}

function StableTableCell23() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">01/06/2025</p>
      </div>
    </div>
  );
}

function StableTableGrid23() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-h-px min-w-px relative" data-name="Stable Table/ Grid">
      <StableTableCell23 />
    </div>
  );
}

function CircleSmall3() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Circle Small">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2_9586)" id="Circle Small">
          <path d={svgPaths.p2bf13170} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
        <defs>
          <clipPath id="clip0_2_9586">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Icon5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon">
      <CircleSmall3 />
    </div>
  );
}

function TextOffset3() {
  return (
    <div className="content-stretch flex flex-col h-[14px] items-start justify-center px-[2px] py-0 relative shrink-0" data-name="Text offset">
      <div className="css-g0mm18 flex flex-col font-['Inter:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#616161] text-[10px] text-center">
        <p className="css-ew64yg leading-[14px]">Concluded</p>
      </div>
    </div>
  );
}

function Badge3() {
  return (
    <div className="bg-[#f0f0f0] h-[20px] min-w-[20px] relative rounded-[9999px] shrink-0" data-name="Badge">
      <div className="content-stretch flex h-full items-center justify-center min-w-[inherit] overflow-clip px-[6px] py-0 relative rounded-[inherit]">
        <Icon5 />
        <TextOffset3 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function StableTableCell24() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <Badge3 />
    </div>
  );
}

function StableTableGrid24() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[123px]" data-name="Stable Table/ Grid">
      <StableTableCell24 />
    </div>
  );
}

function MoreHorizontal5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="More Horizontal">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="More Horizontal">
          <path d={svgPaths.p167dfbf2} fill="var(--fill-0, #242424)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Container">
      <MoreHorizontal5 />
    </div>
  );
}

function StableTableRow4() {
  return (
    <div className="bg-white h-[44px] relative shrink-0 w-full" data-name="Stable Table/ Row">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[20px] items-center px-[20px] py-0 relative size-full">
          <StableTableGrid20 />
          <StableTableGrid21 />
          <StableTableGrid22 />
          <StableTableGrid23 />
          <StableTableGrid24 />
          <Container11 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f0f0f0] border-solid inset-[-1px] pointer-events-none" />
    </div>
  );
}

function StableTableCell25() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">20ESCS102</p>
      </div>
    </div>
  );
}

function StableTableGrid25() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[120px]" data-name="Stable Table/ Grid">
      <StableTableCell25 />
    </div>
  );
}

function StableTableCell26() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">TechnoQuiz</p>
      </div>
    </div>
  );
}

function StableTableGrid26() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[299px]" data-name="Stable Table/ Grid">
      <StableTableCell26 />
    </div>
  );
}

function StableTableCell27() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">Boot Camp</p>
      </div>
    </div>
  );
}

function StableTableGrid27() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-h-px min-w-px relative" data-name="Stable Table/ Grid">
      <StableTableCell27 />
    </div>
  );
}

function StableTableCell28() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <div className="css-g0mm18 flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#242424] text-[13px] text-ellipsis">
        <p className="css-g0mm18 leading-[20px] overflow-hidden">01/06/2025</p>
      </div>
    </div>
  );
}

function StableTableGrid28() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-h-px min-w-px relative" data-name="Stable Table/ Grid">
      <StableTableCell28 />
    </div>
  );
}

function CircleSmall4() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Circle Small">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2_9580)" id="Circle Small">
          <path d={svgPaths.p2bf13170} fill="var(--fill-0, #B10E1C)" id="Shape" />
        </g>
        <defs>
          <clipPath id="clip0_2_9580">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Icon6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Icon">
      <CircleSmall4 />
    </div>
  );
}

function TextOffset4() {
  return (
    <div className="content-stretch flex flex-col h-[14px] items-start justify-center px-[2px] py-0 relative shrink-0" data-name="Text offset">
      <div className="css-g0mm18 flex flex-col font-['Inter:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#b10e1c] text-[10px] text-center">
        <p className="css-ew64yg leading-[14px]">Rejected</p>
      </div>
    </div>
  );
}

function Badge4() {
  return (
    <div className="bg-[#fdf3f4] h-[20px] min-w-[20px] relative rounded-[9999px] shrink-0" data-name="Badge">
      <div className="content-stretch flex h-full items-center justify-center min-w-[inherit] overflow-clip px-[6px] py-0 relative rounded-[inherit]">
        <Icon6 />
        <TextOffset4 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#eeacb2] border-solid inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function StableTableCell29() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative" data-name="Stable Table/ Cell">
      <Badge4 />
    </div>
  );
}

function StableTableGrid29() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[123px]" data-name="Stable Table/ Grid">
      <StableTableCell29 />
    </div>
  );
}

function MoreHorizontal6() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="More Horizontal">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="More Horizontal">
          <path d={svgPaths.p167dfbf2} fill="var(--fill-0, #242424)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Container">
      <MoreHorizontal6 />
    </div>
  );
}

function StableTableRow5() {
  return (
    <div className="bg-white h-[44px] relative shrink-0 w-full" data-name="Stable Table/ Row">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[20px] items-center px-[20px] py-0 relative size-full">
          <StableTableGrid25 />
          <StableTableGrid26 />
          <StableTableGrid27 />
          <StableTableGrid28 />
          <StableTableGrid29 />
          <Container12 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f0f0f0] border-solid inset-[-1px] pointer-events-none" />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <StableTableRow1 />
      <StableTableRow2 />
      <StableTableRow3 />
      <StableTableRow4 />
      <StableTableRow5 />
    </div>
  );
}

function Group12() {
  return (
    <div className="relative shrink-0 size-[28px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Group 158623">
          <path d="M28 0H0V28H28V0Z" fill="var(--fill-0, #707070)" id="Rectangle 150352" opacity="0" />
          <g id="chevrons-left">
            <path d={svgPaths.p2d428500} id="Vector" stroke="var(--stroke-0, #242424)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p23a9b500} id="Vector_2" stroke="var(--stroke-0, #242424)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Group11() {
  return (
    <div className="relative shrink-0 size-[28px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Group 158622">
          <path d="M28 0H0V28H28V0Z" fill="var(--fill-0, #707070)" id="Rectangle 150352" opacity="0" />
          <g id="chevron-left">
            <path d="M16.5 19L11.5 14L16.5 9" id="Vector" stroke="var(--stroke-0, #242424)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0">
      <Group12 />
      <Group11 />
    </div>
  );
}

function Group6() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="col-1 ml-0 mt-0 row-1 size-[28px]" />
      <p className="col-1 css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[16px] ml-[14px] mt-[5px] not-italic relative row-1 text-[#242424] text-[12px] text-center translate-x-[-50%] w-[8px]">1</p>
    </div>
  );
}

function Group7() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-white col-1 ml-0 mt-0 row-1 size-[28px]" />
      <p className="col-1 css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] ml-[10px] mt-[6.5px] not-italic relative row-1 text-[#242424] text-[12px]">2</p>
    </div>
  );
}

function Group8() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-white col-1 ml-0 mt-0 row-1 size-[28px]" />
      <p className="col-1 css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] ml-[10px] mt-[6.5px] not-italic relative row-1 text-[#242424] text-[12px]">3</p>
    </div>
  );
}

function Group9() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-white col-1 ml-0 mt-0 row-1 size-[28px]" />
      <p className="col-1 css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] ml-[10px] mt-[6.5px] not-italic relative row-1 text-[#242424] text-[12px]">4</p>
    </div>
  );
}

function Group10() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] relative shrink-0">
      <div className="bg-white col-1 ml-0 mt-0 row-1 size-[28px]" />
      <p className="col-1 css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] ml-[10px] mt-[6.5px] not-italic relative row-1 text-[#242424] text-[12px]">5</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[12px] items-start leading-[0] relative shrink-0">
      <Group6 />
      <Group7 />
      <Group8 />
      <Group9 />
      <Group10 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <Frame8 />
      <Frame />
    </div>
  );
}

function Group5() {
  return (
    <div className="relative shrink-0 size-[28px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Group 158557">
          <path d="M28 0H0V28H28V0Z" fill="var(--fill-0, #707070)" id="Rectangle 150352" opacity="0" />
          <g id="chevron-right">
            <path d="M11.5 19L16.5 14L11.5 9" id="Vector" stroke="var(--stroke-0, #242424)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="relative shrink-0 size-[28px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Group 158556">
          <path d="M28 0H0V28H28V0Z" fill="var(--fill-0, #707070)" id="Rectangle 150352" opacity="0" />
          <g id="chevrons-right">
            <path d={svgPaths.p22a36900} id="Vector" stroke="var(--stroke-0, #242424)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.pe9fe800} id="Vector_2" stroke="var(--stroke-0, #242424)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0">
      <Group5 />
      <Group4 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <Frame1 />
      <Frame2 />
    </div>
  );
}

function Group13() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-0 mt-0 relative row-1">
      <p className="col-1 css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[16px] ml-[16px] mt-[5px] not-italic relative row-1 text-[#242424] text-[12px] text-center translate-x-[-50%] w-[16px]">5</p>
      <div className="col-1 h-[28px] ml-0 mt-0 row-1 w-[49px]" />
      <div className="col-1 flex h-[4.167px] items-center justify-center ml-[32px] mt-[12.08px] relative row-1 w-[8.333px]">
        <div className="flex-none h-[8.333px] rotate-[90deg] w-[4.167px]">
          <div className="relative size-full" data-name="Vector">
            <div className="absolute inset-[-7.2%_-14.4%]" style={{ "--stroke-0": "rgba(36, 36, 36, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.36667 9.53333">
                <path d={svgPaths.p7cf5a00} id="Vector" stroke="var(--stroke-0, #242424)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group14() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <p className="col-1 css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[16px] ml-[57px] mt-[5px] not-italic relative row-1 text-[#242424] text-[12px] w-[100px]">Items per Page</p>
      <Group13 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Group14 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame7 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#242424] text-[12px]">1-5 of 123 items</p>
      <Frame5 />
      <Frame4 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-[#fafafa] relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start px-[24px] py-[6px] relative w-full">
        <Frame6 />
      </div>
    </div>
  );
}

function UserTable() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px overflow-clip relative" data-name="User Table">
      <StableTableRow />
      <Frame11 />
      <Frame14 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[6px]">
      <div className="content-stretch flex items-start overflow-clip relative rounded-[inherit] w-full">
        <UserTable />
      </div>
      <div aria-hidden="true" className="absolute border border-[#f0f0f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Frame10() {
  return (
    <div className="relative rounded-[6px] shrink-0 w-full">
      <div className="content-stretch flex items-start overflow-clip relative rounded-[inherit] w-full">
        <Frame29 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#f0f0f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame28 />
      <Frame10 />
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame22 />
      <Frame27 />
    </div>
  );
}

function Info() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Info">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Info">
          <path d={svgPaths.p16707000} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
      <Info />
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#616161] text-[12px]">Select an event from the list to view details. You can also update event information, if needed, for the selected event.</p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px p-[24px] relative w-[1028px]">
      <Frame35 />
      <Frame26 />
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative self-stretch">
      <Frame42 />
      <Frame25 />
    </div>
  );
}

function Frame40() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-[52px] w-[1280px]">
      <MainMenuIqac />
      <MenuWithAySelection />
      <Frame41 />
    </div>
  );
}

export default function EventList() {
  return (
    <div className="bg-white relative size-full" data-name="Event List">
      <Header2 />
      <Frame40 />
    </div>
  );
}