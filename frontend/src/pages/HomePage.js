import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const foodImages = [
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
  'https://images.unsplash.com/photo-1484723051597-62b8a78889c6?w=800&q=80',
  'https://images.unsplash.com/photo-1473093221436-7c18e4788139?w=800&q=80',
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80',
];

const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const HomePageContainer = styled.div`
  width: 100%;
  overflow: hidden;
  color: var(--text-color);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const StyledLinkButton = styled(Link)`
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  text-decoration: none;
  color: var(--secondary-color);
  background-color: var(--primary-color);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

const CatererLinkButton = styled(StyledLinkButton)`
  background-color: #333;
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 55vh;
  background: linear-gradient(120deg, #fffbe6 0%, #ffe5b4 100%);
  border-radius: 24px;
  margin: 2.5rem auto 2rem auto;
  max-width: 900px;
  box-shadow: 0 4px 32px #f3e6d1;
  padding: 3rem 2rem 2.5rem 2rem;
`;

const HeroLogo = styled.img`
  height: 70px;
  border-radius: 12px;
  margin-bottom: 1.2rem;
`;

const HeroTitle = styled.h1`
  font-size: 2.7rem;
  color: #FFA500;
  font-weight: bold;
  margin-bottom: 1.1rem;
  letter-spacing: 2px;
  text-align: center;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: #444;
  max-width: 600px;
  margin: 0 auto 1.7rem auto;
  line-height: 1.7;
  text-align: center;
`;

const CarouselWrapper = styled.div`
  width: 100vw;
  max-width: 1200px;
  margin: 0 auto 2.5rem auto;
  overflow: hidden;
  border-radius: 18px;
`;

const Carousel = styled.div`
  width: 200%;
  display: flex;
  animation: ${scroll} 30s linear infinite;
`;

const CarouselImage = styled.div`
  width: 16%;
  height: 32vh;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 0;
  margin: 0;
`;

const HomePage = () => {
  return (
    <HomePageContainer>
      <HeroSection>
        <HeroLogo src="https://i.pinimg.com/736x/cd/46/dd/cd46dda11eec042b2cfc2ec6c497f5ce.jpg" alt="Mealy Logo" />
        <HeroTitle>Welcome to Mealy</HeroTitle>
        <HeroSubtitle>
          Never miss a meal again. Mealy connects you with talented local caterers, bringing delicious, home-cooked meals right to your doorstep. Browse daily menus, schedule your deliveries for the week, and enjoy the convenience of great food, made easy.
        </HeroSubtitle>
        <ButtonContainer>
          <StyledLinkButton to="/signup">Create a Customer Account</StyledLinkButton>
          <CatererLinkButton to="/caterer-signup">Want to Become a Caterer?</CatererLinkButton>
          <StyledLinkButton to="/login">Login</StyledLinkButton>
        </ButtonContainer>
      </HeroSection>
      <CarouselWrapper>
        <Carousel>
          {[...foodImages, ...foodImages].map((src, index) => (
            <CarouselImage key={index} src={src} />
          ))}
        </Carousel>
      </CarouselWrapper>
    </HomePageContainer>
  );
};

export default HomePage; 