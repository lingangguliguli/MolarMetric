-- ============================================================================
-- Daily Motivational Messages — 90+ curated messages
-- ============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_motivations_message ON daily_motivations(message);

INSERT INTO daily_motivations (message, category) VALUES
-- Progress & Consistency
('Small, consistent improvements create meaningful progress. Focus on the next useful action.', 'progress'),
('Every patient interaction is an opportunity to build lasting trust.', 'progress'),
('The most effective teams are built on small daily habits, not dramatic changes.', 'progress'),
('Progress is rarely visible day-to-day, but always visible month-to-month.', 'progress'),
('Your attention to detail today shapes the experience patients remember.', 'progress'),
('One thoughtful follow-up at the right time can change someone''s health journey.', 'progress'),
('Excellence is not a destination — it''s a daily practice.', 'progress'),
('The best systems are built one improvement at a time.', 'progress'),
('Momentum comes from showing up and doing the work, even on quiet days.', 'progress'),
('Today is a fresh opportunity to help someone take the next step in their care.', 'progress'),

-- Focus & Clarity
('Clarity comes from action, not deliberation. Take the next step.', 'focus'),
('Focus on what you can control: your preparation, your follow-through, your kindness.', 'focus'),
('A clear process reduces stress and improves outcomes for everyone.', 'focus'),
('The simplest approach that works is usually the best one.', 'focus'),
('When everything feels urgent, start with the most important thing.', 'focus'),
('Your calm and organised presence makes a real difference.', 'focus'),
('Good systems free your mind to focus on the people in front of you.', 'focus'),
('Start where you are. Use what you have. Do what you can.', 'focus'),
('The most impactful work often happens in quiet, focused moments.', 'focus'),
('A well-prepared team handles surprises with grace.', 'focus'),

-- Teamwork
('Great results come from people who support each other every day.', 'teamwork'),
('A team that communicates well can handle any challenge.', 'teamwork'),
('Your colleagues rely on your consistency — and you can rely on theirs.', 'teamwork'),
('Shared goals create shared success.', 'teamwork'),
('The strength of the team is each individual member. The strength of each member is the team.', 'teamwork'),
('Take a moment to appreciate someone on your team today.', 'teamwork'),
('Trust is built through reliability, not grand gestures.', 'teamwork'),
('A supportive word at the right time can lift the whole team.', 'teamwork'),
('Together, you create experiences that no one could deliver alone.', 'teamwork'),
('Good communication is the foundation of good care.', 'teamwork'),

-- Helping People
('Behind every enquiry is a person hoping for a better experience.', 'helping'),
('Your responsiveness shows patients that their time and concerns matter.', 'helping'),
('A warm welcome sets the tone for everything that follows.', 'helping'),
('Listening carefully is the first step to helping effectively.', 'helping'),
('Every person who walks through the door deserves to feel seen and respected.', 'helping'),
('Sometimes the most helpful thing is simply being available.', 'helping'),
('People remember how you made them feel long after they forget the details.', 'helping'),
('Your patience today might be the reason someone returns tomorrow.', 'helping'),
('Helping someone overcome hesitation about their health is meaningful work.', 'helping'),
('A friendly voice on the phone can ease someone''s anxiety about visiting.', 'helping'),

-- Growth & Learning
('Every challenge you face makes you better at handling the next one.', 'growth'),
('Curiosity is a superpower. Keep asking questions.', 'growth'),
('The best professionals never stop learning.', 'growth'),
('Feedback is a gift — it shows where you can grow.', 'growth'),
('Mistakes are lessons in disguise. What matters is what you do next.', 'growth'),
('Your skills today were someone else''s impossible yesterday.', 'growth'),
('Growth happens just outside your comfort zone.', 'growth'),
('Each day brings a new chance to refine your approach.', 'growth'),
('The willingness to improve is more valuable than any talent.', 'growth'),
('Learning something new every week compounds into expertise over time.', 'growth'),

-- Resilience
('Difficult days are part of the journey. They don''t define it.', 'resilience'),
('Persistence through setbacks is what separates good from great.', 'resilience'),
('You''ve handled tough situations before. You''ll handle this one too.', 'resilience'),
('Rest when you need to, but don''t give up on what matters.', 'resilience'),
('Even on hard days, your work makes a difference to someone.', 'resilience'),
('Challenges are temporary. The skills you build from them are permanent.', 'resilience'),
('A slow day is not a wasted day — it''s preparation for the busy ones.', 'resilience'),
('Patience with yourself is just as important as patience with others.', 'resilience'),
('The only way forward is through. Take it one step at a time.', 'resilience'),
('Your steadiness in uncertain moments is a gift to those around you.', 'resilience'),

-- Purpose
('Meaningful work doesn''t always feel extraordinary. Sometimes it''s just showing up.', 'purpose'),
('You are part of a system that helps people live healthier, more confident lives.', 'purpose'),
('The work you do behind the scenes enables the care that happens in front.', 'purpose'),
('Every well-managed follow-up is an act of care.', 'purpose'),
('Your role connects people with the help they need.', 'purpose'),
('The impact you make extends far beyond what you can see.', 'purpose'),
('Operational excellence is a form of caring for your patients and your team.', 'purpose'),
('When you do your job well, everyone around you benefits.', 'purpose'),
('Purpose isn''t found in perfection — it''s found in consistent effort.', 'purpose'),
('Your contribution matters more than you realise.', 'purpose'),

-- Positivity & Wellbeing
('Take a deep breath. You''re doing better than you think.', 'wellbeing'),
('Celebrate the small wins. They add up to something remarkable.', 'wellbeing'),
('A moment of gratitude can shift your entire perspective.', 'wellbeing'),
('Your wellbeing matters. Take care of yourself so you can take care of others.', 'wellbeing'),
('Start with a smile — it''s the simplest way to improve any interaction.', 'wellbeing'),
('Progress, not perfection, is what matters.', 'wellbeing'),
('A positive mindset is the most powerful tool in your toolkit.', 'wellbeing'),
('Remember why you started. That reason still matters.', 'wellbeing'),
('The best time to do something good is right now.', 'wellbeing'),
('End each day knowing you did your best with what you had.', 'wellbeing'),

-- Dental-specific operational
('A well-organised schedule prevents stress for everyone — patients and staff alike.', 'dental'),
('Follow-up isn''t just a task — it''s how you show patients they''re valued.', 'dental'),
('The gap between a missed call and a returned call is where trust is built.', 'dental'),
('Clear treatment plans help patients make confident decisions about their health.', 'dental')
ON CONFLICT (message) DO NOTHING;
