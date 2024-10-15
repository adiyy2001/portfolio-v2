import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig, email } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledContactSection = styled.section`
  max-width: 600px;
  margin: 0 auto 100px;
  text-align: center;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
  }

  .overline {
    display: block;
    margin-bottom: 20px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: 400;

    &:before {
      bottom: 0;
      font-size: var(--fz-sm);
    }

    &:after {
      display: none;
    }
  }

  .title {
    font-size: clamp(40px, 5vw, 60px);
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const Contact = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

return (
  <StyledContactSection id="contact" ref={revealContainer}>
    <h2 className="numbered-heading overline">What’s Next?</h2>

    <h2 className="title">Let’s Connect</h2>

    <p>
      I’m currently exploring new opportunities to tackle complex challenges and contribute to 
      impactful projects. If you think there’s a fit or simply want to chat, feel free to reach out. 
      My inbox is always open, and I’d be happy to connect!
    </p>

    <a className="email-link" href={`mailto:${email}`}>
      Reach Out
    </a>
  </StyledContactSection>
);

};

export default Contact;
