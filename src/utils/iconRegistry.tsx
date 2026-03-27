import type { IconType } from "react-icons";
import { FaBook, FaGlobe, FaLink } from "react-icons/fa";
import { FaChevronDown, FaChevronUp, FaGolang } from "react-icons/fa6";
import {
  SiAntdesign,
  SiConfluence,
  SiCss3,
  SiExpress,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJenkins,
  SiJira,
  SiJavascript,
  SiLinkedin,
  SiMiro,
  SiMongodb,
  SiMui,
  SiMysql,
  SiNodedotjs,
  SiNpm,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiReact,
  SiRedux,
  SiSplunk,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { VscCopy, VscVscode } from "react-icons/vsc";

const ICONS: Record<string, IconType> = {
  FaBook,
  FaChevronDown,
  FaChevronUp,
  FaGlobe,
  FaGolang,
  FaLink,
  SiAntdesign,
  SiConfluence,
  SiCss3,
  SiExpress,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJenkins,
  SiJira,
  SiJavascript,
  SiLinkedin,
  SiMiro,
  SiMongodb,
  SiMui,
  SiMysql,
  SiNodedotjs,
  SiNpm,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiReact,
  SiRedux,
  SiSplunk,
  SiTailwindcss,
  SiTypescript,
  VscCopy,
  VscVscode,
};

export function getIconByName(name?: string): IconType | undefined {
  if (!name) return undefined;
  return ICONS[name];
}
