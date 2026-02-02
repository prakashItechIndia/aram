import svgPaths from "./svg-l4877zrz7i";
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

function Frame2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Button />
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex items-center justify-end p-[10px] relative shrink-0" data-name="Header">
      <Frame2 />
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
      <div className="absolute inset-[0_0_-0.01%_0]">
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

function Frame15() {
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

function Frame3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Button1 />
      <Button2 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame3 />
    </div>
  );
}

function Header1() {
  return (
    <div className="content-stretch flex items-center justify-end pl-[20px] pr-[12px] py-[10px] relative shrink-0" data-name="Header">
      <Frame1 />
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

function Frame() {
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

function Frame14() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
      <Frame />
      <Chevron />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
      <ToggleMultiple />
      <Frame14 />
    </div>
  );
}

function MainNavigation() {
  return (
    <div className="content-stretch flex flex-col h-full items-center justify-center px-[12px] py-[8px] relative shrink-0" data-name="Main Navigation">
      <div aria-hidden="true" className="absolute border-[#8ca5df] border-l border-solid inset-0 pointer-events-none" />
      <Frame4 />
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
      <Frame15 />
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

function Frame16() {
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
          <Frame16 />
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
          <path d={svgPaths.p3859a500} fill="var(--fill-0, #2453C3)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Frame17() {
  return (
    <div className="bg-[#eaf0fb] content-stretch flex flex-col gap-[4px] items-center justify-center p-[8px] relative rounded-[8px] shrink-0 w-[44px]">
      <WrenchSettings />
      <div className="css-g0mm18 flex flex-col font-['Segoe_UI:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#2453c3] text-[6px]">
        <p className="css-ew64yg leading-[14px]">Setup</p>
      </div>
      <div className="absolute bg-[#2453c3] h-[16px] left-0 rounded-[8px] top-[14px] w-[2px]" />
    </div>
  );
}

function MainItem1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Main Item">
      <div className="flex flex-col items-center justify-end size-full">
        <div className="content-stretch flex flex-col gap-[6px] items-center justify-end px-[8px] py-[6px] relative w-full">
          <Frame17 />
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
          <path d={svgPaths.p1f855200} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center p-[8px] relative rounded-[8px] shrink-0 w-[44px]">
      <Briefcase />
      <div className="css-g0mm18 flex flex-col font-['Segoe_UI:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#616161] text-[6px]">
        <p className="css-ew64yg leading-[14px]">Tasks</p>
      </div>
    </div>
  );
}

function MainItem2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Main Item">
      <div className="flex flex-col items-center justify-end size-full">
        <div className="content-stretch flex flex-col gap-[6px] items-center justify-end px-[8px] py-[6px] relative w-full">
          <Frame18 />
        </div>
      </div>
    </div>
  );
}

function Frame5() {
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

function Frame19() {
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
          <Frame19 />
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

function Frame20() {
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
          <Frame20 />
        </div>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col items-start px-0 py-[10px] relative shrink-0 w-full">
      <MainItem3 />
      <MainItem4 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col h-[668px] items-start justify-between relative shrink-0 w-full">
      <Frame5 />
      <Frame8 />
    </div>
  );
}

function MainMenuIqac() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[668px] items-start relative shrink-0 w-[52px]" data-name="Main Menu IQAC">
      <div aria-hidden="true" className="absolute border-[#e0e0e0] border-r border-solid inset-0 pointer-events-none" />
      <Frame6 />
    </div>
  );
}

function WrenchSettings1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Wrench Settings">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Wrench Settings">
          <path d={svgPaths.p3b986500} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function IconText() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Icon + Text">
      <WrenchSettings1 />
      <p className="css-ew64yg font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#242424] text-[13px]">Setup</p>
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

function MainHeader() {
  return (
    <div className="bg-white h-[40px] relative shrink-0 w-full" data-name="Main Header">
      <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-r-[0.641px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[10px] relative size-full">
          <IconText />
          <ListRtl />
        </div>
      </div>
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

function CubeTree() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Cube Tree">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Cube Tree">
          <path d={svgPaths.p2d54bc80} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function ContentFrame() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip px-[2px] py-0 relative shrink-0" data-name="content-frame">
      <CubeTree />
      <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#616161] text-[13px]">
        <p className="css-ew64yg leading-[20px]">Calendar</p>
      </div>
    </div>
  );
}

function MenuItem() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Menu Item">
      <div className="content-stretch flex gap-[4px] items-start px-[8px] py-[4px] relative w-full">
        <ContentFrame />
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <MenuItem />
    </div>
  );
}

function PeopleTeamAdd() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="People Team Add">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="People Team Add">
          <path d={svgPaths.p83bdec0} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function ContentFrame1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip px-[2px] py-0 relative shrink-0" data-name="content-frame">
      <PeopleTeamAdd />
      <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#616161] text-[13px]">
        <p className="css-ew64yg leading-[20px]">Committees</p>
      </div>
    </div>
  );
}

function MenuItem1() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Menu Item">
      <div className="content-stretch flex gap-[4px] items-start px-[8px] py-[4px] relative w-full">
        <ContentFrame1 />
      </div>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <MenuItem1 />
    </div>
  );
}

function RibbonStar() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Ribbon Star">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Ribbon Star">
          <path d={svgPaths.p1f346980} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function ContentFrame2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip px-[2px] py-0 relative shrink-0" data-name="content-frame">
      <RibbonStar />
      <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#2453c3] text-[13px]">
        <p className="css-ew64yg leading-[20px]">Co-Ordinator</p>
      </div>
    </div>
  );
}

function MenuItem2() {
  return (
    <div className="bg-[#eaf0fb] relative rounded-[4px] shrink-0 w-full" data-name="Menu Item">
      <div className="content-stretch flex items-start px-[8px] py-[4px] relative w-full">
        <ContentFrame2 />
      </div>
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <MenuItem2 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame39 />
    </div>
  );
}

function WindowBulletListAdd() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Window Bullet List Add">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Window Bullet List Add">
          <path d={svgPaths.p3a4f4200} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function ContentFrame3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip px-[2px] py-0 relative shrink-0" data-name="content-frame">
      <WindowBulletListAdd />
      <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#616161] text-[13px]">
        <p className="css-ew64yg leading-[20px]">Event</p>
      </div>
    </div>
  );
}

function MenuItem3() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Menu Item">
      <div className="content-stretch flex gap-[4px] items-start px-[8px] py-[4px] relative w-full">
        <ContentFrame3 />
      </div>
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <MenuItem3 />
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
      <div className="content-stretch flex gap-[4px] items-start px-[8px] py-[4px] relative w-full">
        <ContentFrame4 />
      </div>
    </div>
  );
}

function DocumentBulletList() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Document Bullet List">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Document Bullet List">
          <path d={svgPaths.pe166100} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function ContentFrame5() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip px-[2px] py-0 relative shrink-0" data-name="content-frame">
      <DocumentBulletList />
      <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#616161] text-[13px]">
        <p className="css-ew64yg leading-[20px]">Audit Checklist</p>
      </div>
    </div>
  );
}

function MenuItem5() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Menu Item">
      <div className="content-stretch flex gap-[4px] items-start px-[8px] py-[4px] relative w-full">
        <ContentFrame5 />
      </div>
    </div>
  );
}

function Navigation1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative w-full" data-name="Navigation">
      <Frame36 />
      <Frame37 />
      <Frame7 />
      <Frame38 />
      <MenuItem4 />
      <MenuItem5 />
    </div>
  );
}

function MainNavigation3() {
  return (
    <div className="bg-white h-[628px] relative shrink-0 w-full" data-name="Main Navigation">
      <div aria-hidden="true" className="absolute border-[#e0e0e0] border-r-[0.641px] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[12px] relative size-full">
        <Input />
        <Navigation1 />
      </div>
    </div>
  );
}

function SubMenuIqacSetup() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[200px]" data-name="Sub Menu IQAC Setup">
      <MainHeader />
      <MainNavigation3 />
    </div>
  );
}

function TextWrapperForOffset() {
  return (
    <div className="content-stretch flex h-[20px] items-start pb-[3px] pt-px px-0 relative shrink-0" data-name="Text wrapper for offset">
      <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#424242] text-[12px]">
        <p className="css-ew64yg leading-[16px]">Setup</p>
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
      <div className="css-g0mm18 flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#424242] text-[12px]">
        <p className="css-ew64yg leading-[16px]">Co-ordinators</p>
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

function Chevron2() {
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

function Divider1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Divider">
      <Chevron2 />
    </div>
  );
}

function BreadcrumbItem1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name=".Breadcrumb Item">
      <Button4 />
      <Divider1 />
    </div>
  );
}

function TextWrapperForOffset2() {
  return (
    <div className="content-stretch flex h-[20px] items-start pb-[3px] pt-px px-0 relative shrink-0" data-name="Text wrapper for offset">
      <div className="css-g0mm18 flex flex-col font-['Inter:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#424242] text-[12px]">
        <p className="css-ew64yg leading-[16px]">Create Team</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[4px] h-[20px] items-center justify-center relative shrink-0" data-name="Container">
      <TextWrapperForOffset2 />
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex gap-[6px] items-center justify-center px-[8px] py-0 relative rounded-[4px] shrink-0" data-name="Button">
      <Container5 />
    </div>
  );
}

function BreadcrumbItem2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name=".Breadcrumb Item">
      <Button5 />
    </div>
  );
}

function Breadcrumb() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Breadcrumb">
      <BreadcrumbItem />
      <BreadcrumbItem1 />
      <BreadcrumbItem2 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="bg-[#f0f0f0] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start px-[16px] py-[10px] relative w-full">
        <Breadcrumb />
      </div>
    </div>
  );
}

function Info() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Info">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Info">
          <path d={svgPaths.p391e9400} fill="var(--fill-0, #2453C3)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function IconText1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0" data-name="Icon + Text">
      <Info />
      <div className="css-g0mm18 flex flex-col font-['Inter:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#242424] text-[13px]">
        <p className="css-ew64yg leading-[20px]">Team Details</p>
      </div>
    </div>
  );
}

function Chevron3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Chevron">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Chevron">
          <path d={svgPaths.p3528ec80} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function PeopleTeam() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="People Team">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="People Team">
          <path d={svgPaths.p27903280} fill="var(--fill-0, #BDBDBD)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function IconText2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0" data-name="Icon + Text">
      <PeopleTeam />
      <div className="css-g0mm18 flex flex-col font-['Inter:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#bdbdbd] text-[13px]">
        <p className="css-ew64yg leading-[20px]">Team Structure</p>
      </div>
    </div>
  );
}

function DocumentCheckmark() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Document Checkmark">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Document Checkmark">
          <path d={svgPaths.p255cb200} fill="var(--fill-0, #BDBDBD)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function IconText3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0" data-name="Icon + Text">
      <DocumentCheckmark />
      <div className="css-g0mm18 flex flex-col font-['Inter:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#bdbdbd] text-[13px]">
        <p className="css-ew64yg leading-[20px]">{`Review & Submit`}</p>
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="bg-[#fafafa] h-[52px] relative shrink-0 w-[1028px]">
      <div className="content-stretch flex gap-[32px] items-center overflow-x-auto overflow-y-clip px-[24px] py-[12px] relative size-full">
        <IconText1 />
        <Chevron3 />
        <IconText2 />
        <Chevron3 />
        <IconText3 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Wizard() {
  return (
    <div className="bg-[#fafafa] h-[52px] relative shrink-0 w-[1028px]" data-name="Wizard">
      <div className="content-stretch flex gap-[32px] items-center overflow-x-auto overflow-y-clip px-0 py-[12px] relative size-full">
        <Frame32 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <div className="css-g0mm18 flex flex-col font-['Inter:Semibold',sans-serif] justify-center leading-[0] relative shrink-0 text-[#242424] text-[16px]">
        <p className="css-ew64yg leading-[22px]">Co-ordination Team</p>
      </div>
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-w-full relative shrink-0 text-[#707070] text-[12px] w-[min-content]">Create a new team to align team members</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start not-italic p-[24px] relative w-full">
        <div className="css-g0mm18 flex flex-col font-['Inter:Semibold',sans-serif] justify-center leading-[0] relative shrink-0 text-[#2453c3] text-[10px]">
          <p className="css-ew64yg leading-[14px]">STEP 1</p>
        </div>
        <Frame25 />
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[4px] items-center leading-[20px] not-italic relative shrink-0 text-[13px]" data-name="Label">
      <p className="css-ew64yg relative shrink-0 text-[#242424]">Team Name</p>
      <p className="css-ew64yg relative shrink-0 text-[#b10e1c]">*</p>
    </div>
  );
}

function LabelIcon() {
  return (
    <div className="content-stretch flex h-[26px] items-center pb-[2px] pt-0 px-0 relative shrink-0 w-full" data-name="Label + Icon">
      <Label />
    </div>
  );
}

function Text1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Text">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start pb-[7px] pt-[5px] px-[2px] relative w-full">
          <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#707070] text-[13px]">Enter team name</p>
        </div>
      </div>
    </div>
  );
}

function IconTextStack1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Icon-Text-stack">
      <Text1 />
    </div>
  );
}

function Contents1() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Contents">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-0 relative w-full">
          <IconTextStack1 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d1d1d1] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Input1() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[4px] shrink-0 w-full" data-name="Input">
      <Contents1 />
      <div className="absolute bg-[#616161] bottom-0 h-px left-0 opacity-0 right-0 rounded-[4px]" data-name="Thin underline" />
    </div>
  );
}

function FormText() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Form + Text">
      <Input1 />
    </div>
  );
}

function Field() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[318px]" data-name="Field">
      <LabelIcon />
      <FormText />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[4px] items-center leading-[20px] not-italic relative shrink-0 text-[13px]" data-name="Label">
      <p className="css-ew64yg relative shrink-0 text-[#242424]">Structure Name</p>
      <p className="css-ew64yg relative shrink-0 text-[#b10e1c]">*</p>
    </div>
  );
}

function LabelIcon1() {
  return (
    <div className="content-stretch flex h-[26px] items-center pb-[2px] pt-0 px-0 relative shrink-0 w-full" data-name="Label + Icon">
      <Label1 />
    </div>
  );
}

function Text2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Text">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start pb-[7px] pt-[5px] px-[2px] relative w-full">
          <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#707070] text-[13px]">Enter structure name</p>
        </div>
      </div>
    </div>
  );
}

function IconTextStack2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Icon-Text-stack">
      <Text2 />
    </div>
  );
}

function Contents2() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Contents">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-0 relative w-full">
          <IconTextStack2 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d1d1d1] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Input2() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[4px] shrink-0 w-full" data-name="Input">
      <Contents2 />
      <div className="absolute bg-[#616161] bottom-0 h-px left-0 opacity-0 right-0 rounded-[4px]" data-name="Thin underline" />
    </div>
  );
}

function FormText1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Form + Text">
      <Input2 />
    </div>
  );
}

function Field1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[318px]" data-name="Field">
      <LabelIcon1 />
      <FormText1 />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[4px] items-center leading-[20px] not-italic relative shrink-0 text-[13px]" data-name="Label">
      <p className="css-ew64yg relative shrink-0 text-[#242424]">Members Type</p>
      <p className="css-ew64yg relative shrink-0 text-[#b10e1c]">*</p>
    </div>
  );
}

function LabelIcon2() {
  return (
    <div className="content-stretch flex h-[26px] items-center pb-[2px] pt-0 px-0 relative shrink-0 w-full" data-name="Label + Icon">
      <Label2 />
    </div>
  );
}

function Text3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Text">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start pb-[7px] pt-[5px] px-[2px] relative w-full">
          <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#707070] text-[13px]">Select type</p>
        </div>
      </div>
    </div>
  );
}

function IconTextStack3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Icon-Text-stack">
      <Text3 />
    </div>
  );
}

function IconEnd1Medium() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon End 1 medium">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon End 1 medium">
          <path d={svgPaths.p1832300} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function IconEnd() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-end pl-[2px] pr-0 py-[6px] relative shrink-0" data-name="Icon End">
      <IconEnd1Medium />
    </div>
  );
}

function Contents3() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Contents">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-0 relative w-full">
          <IconTextStack3 />
          <IconEnd />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d1d1d1] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Input3() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[4px] shrink-0 w-full" data-name="Input">
      <Contents3 />
      <div className="absolute bg-[#616161] bottom-0 h-px left-0 opacity-0 right-0 rounded-[4px]" data-name="Thin underline" />
    </div>
  );
}

function Dropdown() {
  return (
    <div className="bg-[#eaf0fb] content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Dropdown">
      <Input3 />
    </div>
  );
}

function FormText2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Form + Text">
      <Dropdown />
    </div>
  );
}

function Field2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[58px] items-start min-h-px min-w-px relative" data-name="Field">
      <LabelIcon2 />
      <FormText2 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[13px] items-center relative shrink-0 w-full">
      <Field />
      <Field1 />
      <Field2 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame10 />
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[4px] items-center leading-[20px] not-italic relative shrink-0 text-[13px]" data-name="Label">
      <p className="css-ew64yg relative shrink-0 text-[#242424]">Objective</p>
      <p className="css-ew64yg relative shrink-0 text-[#b10e1c]">*</p>
    </div>
  );
}

function LabelIcon3() {
  return (
    <div className="content-stretch flex gap-[3px] h-[26px] items-center pb-[2px] pt-0 px-0 relative shrink-0 w-full" data-name="Label + Icon">
      <Label3 />
    </div>
  );
}

function Text4() {
  return (
    <div className="flex-[1_0_0] h-[90px] min-h-[90px] min-w-px relative" data-name="Text">
      <div className="min-h-[inherit] size-full" />
    </div>
  );
}

function Contents4() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Contents">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[18px] py-0 relative w-full">
          <Text4 />
        </div>
      </div>
    </div>
  );
}

function IconStartMedium() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon start medium">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon start medium">
          <path d={svgPaths.p24f4bc00} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="content-stretch flex items-start overflow-clip pb-[7px] pl-[5px] pr-[2px] pt-[5px] relative rounded-[inherit]">
        <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#242424] text-[13px]">12 pt</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#d1d1d1] border-l border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function IconTextStack4() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Icon-Text-stack">
      <IconStartMedium />
      <Text5 />
    </div>
  );
}

function IconEnd1Medium1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon End 1 medium">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon End 1 medium">
          <path d={svgPaths.p1832300} fill="var(--fill-0, #616161)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function IconEnd1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-end pl-[2px] pr-0 py-[6px] relative shrink-0" data-name="Icon End">
      <IconEnd1Medium1 />
    </div>
  );
}

function Contents5() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Contents">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[10px] py-0 relative w-full">
          <IconTextStack4 />
          <IconEnd1 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d1d1d1] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Input4() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[4px] shrink-0" data-name="Input">
      <Contents5 />
      <div className="absolute bg-[#616161] bottom-0 h-px left-0 opacity-0 right-0 rounded-[4px]" data-name="Thin underline" />
    </div>
  );
}

function Dropdown1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Dropdown">
      <Input4 />
    </div>
  );
}

function TextBold() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Text Bold">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Text Bold">
          <path d={svgPaths.p222805c0} fill="var(--fill-0, #242424)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function TextItalic() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Text Italic">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Text Italic">
          <path d={svgPaths.p36fe0600} fill="var(--fill-0, #242424)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function TextUnderline() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Text Underline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Text Underline">
          <path d={svgPaths.p316a9380} fill="var(--fill-0, #242424)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function TextNumberList() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Text Number List">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Text Number List">
          <path d={svgPaths.pf5d9e00} fill="var(--fill-0, #242424)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function TextBulletList() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Text Bullet List">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Text Bullet List">
          <path d={svgPaths.p3f35b580} fill="var(--fill-0, #242424)" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function TextNumberList1() {
  return (
    <div className="bg-[#f5f5f5] relative shrink-0 w-full" data-name="Text Number List">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[24px] py-[8px] relative w-full">
          <Dropdown1 />
          <TextBold />
          <TextItalic />
          <TextUnderline />
          <TextNumberList />
          <TextBulletList />
        </div>
      </div>
    </div>
  );
}

function ResizeHandler() {
  return (
    <div className="absolute bottom-0 right-0 size-[12px]" data-name="Resize handler">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Resize handler">
          <path clipRule="evenodd" d={svgPaths.p121d00} fill="url(#paint0_linear_2_9886)" fillRule="evenodd" id="Vector 1 (Stroke)" />
          <path clipRule="evenodd" d={svgPaths.p26fe7d30} fill="url(#paint1_linear_2_9886)" fillRule="evenodd" id="Vector 2 (Stroke)" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_2_9886" x1="5.53553" x2="6.24264" y1="5.53576" y2="6.24286">
            <stop offset="0.369792" stopColor="#303030" />
            <stop offset="1" stopColor="#BCBCBC" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_2_9886" x1="8.1065" x2="8.81361" y1="6.62152" y2="7.32863">
            <stop offset="0.369792" stopColor="#303030" />
            <stop offset="1" stopColor="#BCBCBC" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Textarea() {
  return (
    <div className="min-h-[90px] relative rounded-[4px] shrink-0 w-full" data-name="Textarea">
      <div className="content-stretch flex flex-col items-start min-h-[inherit] overflow-clip relative rounded-[inherit] w-full">
        <Contents4 />
        <TextNumberList1 />
        <ResizeHandler />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d1d1d1] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Field3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Field">
      <LabelIcon3 />
      <Textarea />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Field3 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame30 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px overflow-x-clip overflow-y-auto relative">
      <Frame33 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative self-stretch">
      <Frame31 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full">
      <Frame34 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[980px]">
      <Frame11 />
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start pb-[24px] pt-0 px-0 relative shrink-0 w-full">
      <Frame12 />
      <Frame13 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="h-[434px] relative shrink-0 w-full">
      <div className="overflow-x-clip overflow-y-auto size-full">
        <div className="content-stretch flex flex-col items-start px-[24px] py-0 relative size-full">
          <Frame35 />
        </div>
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px overflow-x-clip overflow-y-auto relative w-full">
      <Frame21 />
      <Frame22 />
    </div>
  );
}

function TextWrapperForOffset3() {
  return (
    <div className="content-stretch flex h-[22px] items-center relative shrink-0" data-name="Text wrapper for offset">
      <div className="css-g0mm18 flex flex-col font-['Inter:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#242424] text-[13px]">
        <p className="css-ew64yg leading-[20px]">Cancel</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[4px] h-[20px] items-center justify-center relative shrink-0" data-name="Container">
      <TextWrapperForOffset3 />
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-white content-stretch flex gap-[6px] items-center justify-center px-[12px] py-[6px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d1d1d1] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container6 />
    </div>
  );
}

function TextWrapperForOffset4() {
  return (
    <div className="content-stretch flex h-[22px] items-center relative shrink-0" data-name="Text wrapper for offset">
      <div className="css-g0mm18 flex flex-col font-['Inter:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#bdbdbd] text-[13px]">
        <p className="css-ew64yg leading-[20px]">Next</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex gap-[4px] h-[20px] items-center justify-center relative shrink-0" data-name="Container">
      <TextWrapperForOffset4 />
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-[#f0f0f0] content-stretch flex gap-[6px] items-center justify-center px-[12px] py-[6px] relative rounded-[4px] shrink-0" data-name="Button">
      <Container7 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Button7 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="bg-white h-[52px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e0e0e0] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[12px] relative size-full">
          <Button6 />
          <Frame9 />
        </div>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col h-[628px] items-start relative shrink-0 w-[1028px]">
      <Wizard />
      <Frame26 />
      <Frame27 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative self-stretch">
      <Frame24 />
      <Frame23 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-[52px] w-[1280px]">
      <MainMenuIqac />
      <SubMenuIqacSetup />
      <Frame29 />
    </div>
  );
}

export default function CreateTeam() {
  return (
    <div className="bg-white relative size-full" data-name="Create Team">
      <Header2 />
      <Frame28 />
    </div>
  );
}