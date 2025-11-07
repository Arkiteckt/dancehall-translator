import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Music, Users, Clock, TrendingUp } from 'lucide-react';

const DashboardContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  margin-bottom: 3rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  color: #8f9bb3;
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  background: #1a1d23;
  border: 1px solid #2a2f3a;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: #8f9bb3;
  font-size: 0.9rem;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ActionCard = styled(motion.button)`
  background: #1a1d23;
  border: 1px solid #2a2f3a;
  border-radius: 16px;
  padding: 2rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  &:hover {
    border-color: #667eea;
    transform: translateY(-5px);
  }
`;

const ActionIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1rem;
`;

const ActionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const ActionDescription = styled.p`
  color: #8f9bb3;
  line-height: 1.5;
`;

function Dashboard({ onStartTranslation, userAddress }) {
  const stats = [
    { icon: Music, value: '12', label: 'Translations Completed' },
    { icon: Users, value: '3', label: 'Active Bounties' },
    { icon: Clock, value: '24m', label: 'Avg. Translation Time' },
    { icon: TrendingUp, value: '98%', label: 'Accuracy Rate' },
  ];

  const actions = [
    {
      icon: Music,
      title: 'New Translation',
      description: 'Translate Dancehall lyrics to Brazilian Portuguese with AI-powered accuracy',
      onClick: onStartTranslation,
    },
    {
      icon: Users,
      title: 'View Bounties',
      description: 'Check active translation bounties and contribute to the community',
      onClick: () => console.log('Navigate to bounties'),
    },
    {
      icon: Clock,
      title: 'Translation History',
      description: 'Review your past translations and cultural notes',
      onClick: () => console.log('Navigate to history'),
    },
  ];

  return (
    <DashboardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <WelcomeSection>
        <WelcomeTitle>Welcome to Dancehall Translator</WelcomeTitle>
        <WelcomeSubtitle>
          AI-powered translations with human verification. Connect Jamaican culture with Brazilian Portuguese.
        </WelcomeSubtitle>
      </WelcomeSection>

      <StatsGrid>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <StatCard
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <StatIcon>
                <IconComponent size={24} />
              </StatIcon>
              <StatContent>
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatContent>
            </StatCard>
          );
        })}
      </StatsGrid>

      <ActionGrid>
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <ActionCard
              key={action.title}
              onClick={action.onClick}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ActionIcon>
                <IconComponent size={24} />
              </ActionIcon>
              <ActionTitle>{action.title}</ActionTitle>
              <ActionDescription>{action.description}</ActionDescription>
            </ActionCard>
          );
        })}
      </ActionGrid>
    </DashboardContainer>
  );
}

export default Dashboard;