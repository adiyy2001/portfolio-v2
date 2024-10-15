import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;
const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;
const StyledPic = styled.div`
  position: relative;
  max-width: 300px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--green);

    &:hover,
    &:focus {
      outline: 0;
      transform: translate(-4px, -4px);

      &:after {
        transform: translate(8px, 8px);
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      background-color: var(--navy);
      mix-blend-mode: screen;
    }

    &:after {
      border: 2px solid var(--green);
      top: 14px;
      left: 14px;
      z-index: -1;
    }
  }
`;

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const skills = ['JavaScript (ES6+)', 'TypeScript', 'React', 'Eleventy', 'Node.js', 'WordPress'];

return (
  <StyledAboutSection id="about" ref={revealContainer}>
    <h2 className="numbered-heading">About Me</h2>

    <div className="inner">
      <StyledText>
        <div>
          <p>
            Hello! I'm Adrian Turbiński, a software engineer with a deep passion for tackling 
            complex problems and crafting innovative solutions. My journey in web development 
            began with a curiosity for how things work, which has since transformed into a 
            drive to make the web a more intuitive and powerful place.
          </p>

          <p>
            Throughout my career, I’ve embraced a variety of challenging roles, from the 
            fast-paced startup environment at <a href="https://www.cobiro.com">Cobiro</a>, 
            where agility and adaptability were key, to large corporate landscapes like{' '}
            <a href="https://www.roche.com">Roche</a> and <a href="https://ttms.pl">
            Transition Technologies MS</a>, where I developed scalable solutions and collaborated 
            on multi-faceted projects. My time at <a href="https://www.brainode.com">BRAINODE sp. 
            z o.o.</a>, a local software house, allowed me to delve deeper into custom software 
            tailored to unique client needs.
          </p>

          <p>
            Today, as the founder of <a href="https://www.mediahunters.com">Media Hunters</a>, 
            I focus on solving complex challenges through user-centered design and cutting-edge 
            technology. I work extensively with a wide range of technologies, including those 
            for database management, to deliver robust and efficient solutions.
          </p>

          <p>Here are some of the technologies I currently work with:</p>
        </div>

        <ul className="skills-list">
          {skills && skills.map((skill, i) => <li key={i}>{skill}</li>)}
        </ul>
      </StyledText>

      <StyledPic>
        <div className="wrapper">
          <StaticImage
            className="img"
            src="../../images/me.jpg"
            width={500}
            quality={95}
            formats={['AUTO', 'WEBP', 'AVIF']}
            alt="Headshot"
          />
        </div>
      </StyledPic>
    </div>
  </StyledAboutSection>
);


};

export default About;
