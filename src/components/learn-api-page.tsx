
"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Server, 
  Smartphone, 
  Zap, 
  Network, 
  Handshake, 
  ToyBrick, 
  User, 
  FileText, 
  Building, 
  ArrowRight,
  CloudSun,
  ShoppingCart,
  MessageSquare,
  Map,
  Mail,
  FilePlus,
  FileCheck,
  Trash2,
  KeyRound,
  Users,
  CreditCard,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';
import { ApiChatbot } from './api-chatbot';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';


// Part 1: Hero Section Component
const HeroSection = () => {
  const [learningMode, setLearningMode] = useState<'beginner' | 'intermediate'>('beginner');

  return (
    <div className="relative bg-neutral-900 text-white py-20 px-4 overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-grid-white/[0.07] [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-32 flex items-center justify-between opacity-20">
        <Smartphone className="w-16 h-16 text-blue-400" />
        <div className="w-full h-px bg-gradient-to-r from-blue-400 to-green-400 relative">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute -top-1 w-2 h-2 bg-white rounded-full"
              initial={{ offsetDistance: '0%' }}
              animate={{ offsetDistance: '100%' }}
              transition={{ 
                duration: 3 + i, 
                repeat: Infinity, 
                ease: 'linear'
              }}
              style={{ motionPath: { path: "M0,0 H1000" } }}
            />
          ))}
        </div>
        <Server className="w-16 h-16 text-green-400" />
      </div>

      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to the API Learning Center</h1>
        <p className="text-lg text-neutral-300 max-w-2xl mx-auto mb-8">
          Transform intimidating technical docs into an engaging, visual journey. Let's make learning fun.
        </p>

        <div className="max-w-md mx-auto mb-8">
          <div className="w-full bg-neutral-700 rounded-full h-2.5">
            <motion.div
              className="bg-primary h-2.5 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '10%' }} 
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-sm text-neutral-400 mt-2">Your Learning Journey: 10% Complete</p>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setLearningMode('beginner')}
            className={cn(
              "bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors",
              learningMode === 'beginner' && 'bg-primary text-primary-foreground'
            )}
          >
            Complete Beginner
          </Button>
          <Button
            onClick={() => setLearningMode('intermediate')}
            className={cn(
              "bg-transparent border border-neutral-500 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors",
              learningMode === 'intermediate' && 'bg-neutral-700 text-white'
            )}
          >
            I Know Some Basics
          </Button>
        </div>
      </div>
    </div>
  );
};

// Part 2: Prerequisites Section
const PrerequisiteBlock = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="bg-card border rounded-lg p-6 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-shadow"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="text-primary mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{children}</p>
    </motion.div>
  );
};

const PrerequisitesSection = () => (
  <div className="py-16">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl font-bold">First, The Foundations</h2>
      <p className="text-muted-foreground mt-2">Before we dive into APIs, let's cover a few key concepts.</p>
    </motion.div>
    <div className="grid md:grid-cols-3 gap-8">
      <PrerequisiteBlock
        icon={<Network className="w-12 h-12" />}
        title="The Internet"
      >
        A global network of computers that allows users to share information and communicate. It's the highway system for data.
      </PrerequisiteBlock>
      <PrerequisiteBlock
        icon={<Handshake className="w-12 h-12" />}
        title="Client & Server"
      >
        The Client (your device) asks for information, and the Server (a powerful computer) provides it. This is the core relationship of the web.
      </PrerequisiteBlock>
      <PrerequisiteBlock
        icon={<ToyBrick className="w-12 h-12" />}
        title="What is Data?"
      >
        Simply put, data is just information. It can be text, images, numbers, or anything else that can be stored and processed by a computer.
      </PrerequisiteBlock>
    </div>
  </div>
);


// Part 3: API Fundamentals
const ApiFundamentalsSection = () => {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="py-16 bg-muted rounded-lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 px-4"
      >
        <h2 className="text-3xl font-bold">What Even IS an API?</h2>
        <p className="text-muted-foreground mt-2">API stands for Application Programming Interface. Let's break that down.</p>
      </motion.div>
      
      <div className="container mx-auto px-4">
        <Card className="shadow-lg">
            <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-center mb-8">The Restaurant Analogy</h3>
                <motion.div 
                    className="flex flex-col md:flex-row items-center justify-between gap-4"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
                        <User className="w-16 h-16 text-primary p-3 bg-primary/10 rounded-full mb-2"/>
                        <h4 className="font-bold">You (Client)</h4>
                        <p className="text-sm text-muted-foreground">You know what you want to eat.</p>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="transform md:-rotate-0 rotate-90">
                        <ArrowRight className="w-12 h-12 text-muted-foreground"/>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
                        <FileText className="w-16 h-16 text-accent p-3 bg-accent/10 rounded-full mb-2"/>
                        <h4 className="font-bold">The Waiter (API)</h4>
                        <p className="text-sm text-muted-foreground">Takes your order in a structured way.</p>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="transform md:-rotate-0 rotate-90">
                         <ArrowRight className="w-12 h-12 text-muted-foreground"/>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
                        <Server className="w-16 h-16 text-green-500 p-3 bg-green-500/10 rounded-full mb-2"/>
                        <h4 className="font-bold">The Kitchen (Server)</h4>
                        <p className="text-sm text-muted-foreground">Prepares your meal based on the order.</p>
                    </motion.div>
                </motion.div>
                 <p className="text-center mt-8 text-muted-foreground max-w-2xl mx-auto">
                    The API is the waiter. It's the messenger that takes your structured request (your order), delivers it to the system that has the data (the kitchen), and brings the response back to you.
                 </p>
            </CardContent>
        </Card>

        <div className="text-center mt-16">
            <h3 className="text-2xl font-bold">An API is a Bridge</h3>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Think of two separate applications as islands. An API acts as a bridge between them, allowing them to share data and functionality securely and efficiently.</p>
            <div className="flex justify-center items-center gap-4 mt-8">
                <Building className="w-16 h-16 text-primary" />
                <div className="w-24 h-2 bg-border relative overflow-hidden rounded-full">
                    <motion.div 
                        className="h-full bg-primary absolute left-0"
                        initial={{x: "-100%"}}
                        whileInView={{ x: ["-100%", "0%", "100%"]}}
                        viewport={{ once: true }}
                        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                    />
                </div>
                <Zap className="w-16 h-16 text-accent" />
            </div>
        </div>
      </div>
    </div>
  );
};

// Part 4: Interactive Discovery
const InteractiveDiscoverySection = () => {
  const AppCard = ({ icon, name }: { icon: React.ReactNode, name: string }) => (
    <motion.div
      whileHover="hover"
      initial="initial"
      className="relative bg-card border rounded-lg p-8 flex flex-col items-center justify-center text-center shadow-md hover:shadow-xl transition-shadow cursor-pointer h-full"
    >
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-bold">{name}</h3>
      <AnimatePresence>
        <motion.div
          variants={{
            initial: { opacity: 0, y: 10 },
            hover: { opacity: 1, y: 0 },
          }}
          className="absolute bottom-4"
        >
          <Badge>Powered by APIs</Badge>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div className="py-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold">APIs Are Everywhere</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">You use apps powered by APIs every day without even realizing it. Hover over these examples to see.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <AppCard icon={<CloudSun className="w-16 h-16" />} name="Weather Apps" />
        <AppCard icon={<MessageSquare className="w-16 h-16" />} name="Social Media" />
        <AppCard icon={<ShoppingCart className="w-16 h-16" />} name="E-commerce" />
        <AppCard icon={<Map className="w-16 h-16" />} name="Mapping Services" />
      </div>
    </div>
  );
};

// Part 5: Anatomy of a Request Intro
const AnatomyOfRequestSection = () => {
    const MethodCard = ({ icon, title, color, children }: { icon: React.ReactNode, title: string, color: string, children: React.ReactNode }) => (
        <motion.div 
            className="bg-card border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow h-full"
            whileHover={{ y: -5 }}
        >
            <div className="flex items-center gap-4 mb-4">
            <motion.div
                className={cn("p-2 rounded-full", color)}
                whileHover={{ rotate: 15 }}
            >
                {icon}
            </motion.div>
            <h3 className={cn("text-xl font-bold", color.replace('bg-', 'text-'))}>{title}</h3>
            </div>
            <p className="text-muted-foreground text-sm">{children}</p>
        </motion.div>
    );

    return (
        <div className="py-16 bg-muted rounded-lg">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12 px-4"
            >
                <h2 className="text-3xl font-bold">The Anatomy of a Request</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">To get data from an API, you need to make a "request." Think of it as filling out a specific form to ask the server for what you need.</p>
            </motion.div>
            <div className="container mx-auto px-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">HTTP Methods: The "Verb" of your Request</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <MethodCard icon={<Mail className="w-8 h-8 text-white"/>} title="GET" color="bg-green-500">
                            Retrieves data from a server. It's like asking to **read** a letter from a mailbox without changing it.
                        </MethodCard>
                        <MethodCard icon={<FilePlus className="w-8 h-8 text-white"/>} title="POST" color="bg-orange-500">
                            Submits new data to a server. It's like putting a **new** letter into the mailbox to be filed away.
                        </MethodCard>
                        <MethodCard icon={<FileCheck className="w-8 h-8 text-white"/>} title="PUT" color="bg-blue-500">
                            Updates existing data on a server. It's like **replacing** an entire letter in the mailbox with a new version.
                        </MethodCard>
                        <MethodCard icon={<Trash2 className="w-8 h-8 text-white"/>} title="DELETE" color="bg-red-500">
                            Removes data from a server. It's like taking a letter out of the mailbox and **shredding** it.
                        </MethodCard>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};


// Part 6: Deconstructing the Request
const UrlBreakdown = () => (
    <Card className="shadow-md">
        <CardHeader>
            <CardTitle>The URL</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground mb-4 font-sans text-sm">A URL (Uniform Resource Locator) is the address you use to find a specific resource on the internet.</p>
            <div className="break-all p-4 bg-muted rounded-md flex flex-col md:flex-row gap-x-1 font-code text-sm md:text-base">
                <span className="text-purple-500">https://</span>
                <span className="text-blue-500">api.example.com</span>
                <span className="text-green-500">/v1/users</span>
                <span className="text-orange-500">?id=123</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
                <div><span className="text-purple-500 font-bold">Protocol:</span> The method for exchanging data.</div>
                <div><span className="text-blue-500 font-bold">Domain:</span> The server's address.</div>
                <div><span className="text-green-500 font-bold">Path:</span> The specific resource you want.</div>
                <div><span className="text-orange-500 font-bold">Query Params:</span> Filters to specify your request.</div>
            </div>
        </CardContent>
    </Card>
);

const RequestStructureSection = () => {
    const headers = { "Content-Type": "application/json", "Authorization": "Bearer your_api_key" };
    const body = { "username": "testuser", "isActive": true };

    return (
        <div className="py-16">
            <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12 px-4">
                <h2 className="text-3xl font-bold">Deconstructing the Request</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Besides the URL and Method, a request has a few more important parts.</p>
            </motion.div>
            <div className="container mx-auto px-4 space-y-8">
                <UrlBreakdown />
                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="shadow-md">
                        <CardHeader>
                           <CardTitle>Headers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">Headers provide meta-information about the request, like the format of the data you're sending or your authentication credentials.</p>
                            <div className="bg-muted p-4 rounded-lg font-code text-sm space-y-1">
                                <pre><code>{JSON.stringify(headers, null, 2)}</code></pre>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-md">
                        <CardHeader>
                           <CardTitle>Body (Payload)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">The body contains the actual data you want to send to the server, usually for POST or PUT requests. It's often in JSON format.</p>
                             <div className="bg-muted p-4 rounded-lg font-code text-sm">
                                <pre><code>{JSON.stringify(body, null, 2)}</code></pre>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// Part 7: Visualizing the Response
const StatusCodeCard = ({ code, emoji, title, color, children }: { code: string, emoji: string, title: string, color: string, children: React.ReactNode }) => (
    <div className="bg-card border rounded-lg p-6 shadow-md h-full">
        <div className="flex items-center gap-4 mb-3">
            <div className={cn("text-4xl", color)}>{emoji}</div>
            <div>
                <div className={cn("px-2 py-0.5 rounded-full text-xs font-semibold inline-block", color.replace('text-', 'bg-') + '/20', color)}>
                    {code}
                </div>
                <h3 className="text-xl font-bold mt-1">{title}</h3>
            </div>
        </div>
        <p className="text-sm text-muted-foreground">{children}</p>
    </div>
);

const ResponseAnatomySection = () => (
    <div className="py-16 bg-muted rounded-lg">
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12 px-4">
            <h2 className="text-3xl font-bold">Anatomy of a Response</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">After the server processes your request, it sends back a response. Here’s what you get.</p>
        </motion.div>
        <div className="container mx-auto px-4 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Status Codes</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-6">
                    <StatusCodeCard code="2xx" emoji="😊" title="Success" color="text-green-500">
                        Everything worked as expected! The server has fulfilled your request.
                    </StatusCodeCard>
                    <StatusCodeCard code="4xx" emoji="😕" title="Client Error" color="text-yellow-500">
                        You made a mistake. This could be a bad URL, missing authentication, or invalid data.
                    </StatusCodeCard>
                    <StatusCodeCard code="5xx" emoji="😱" title="Server Error" color="text-red-500">
                        The server messed up. Something went wrong on their end, and they couldn't fulfill your request.
                    </StatusCodeCard>
                </CardContent>
            </Card>
             <div className="grid md:grid-cols-2 gap-8 pt-8">
                    <Card className="shadow-md">
                        <CardHeader><CardTitle>Response Headers</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Similar to request headers, these provide meta-information about the response, like the data format or server details.</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-md">
                        <CardHeader><CardTitle>Response Body</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">This is the main content you asked for, usually in a structured format like JSON that your application can easily parse and use.</p>
                        </CardContent>
                    </Card>
                </div>
        </div>
    </div>
);

// Part 8: Authentication & Security
const AuthCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-card border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow h-full"
  >
    <div className="flex items-center gap-4 mb-3">
      <div className="text-accent">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
    </div>
    <p className="text-sm text-muted-foreground">{children}</p>
  </motion.div>
);

const AuthenticationSection = () => (
  <div className="py-16">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12 px-4"
    >
      <h2 className="text-3xl font-bold">Authentication & Security</h2>
      <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">APIs need to know who is making a request. This is called authentication.</p>
    </motion.div>
    <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
      <AuthCard icon={<KeyRound className="w-10 h-10" />} title="API Keys">
        The simplest form of authentication. It's like a secret password that you send with each request to identify your application.
      </AuthCard>
      <AuthCard icon={<Users className="w-10 h-10" />} title="OAuth 2.0">
        A more secure method where a user grants your app permission to access their data on another service (like Google or Facebook) without sharing their password.
      </AuthCard>
      <AuthCard icon={<CreditCard className="w-10 h-10" />} title="JWT (Tokens)">
        JSON Web Tokens are like a temporary passport. The server gives you a signed token after you log in, which you show with each request to prove who you are.
      </AuthCard>
    </div>
  </div>
);


// Part 9: Conclusion
const ConclusionSection = ({ onCtaClick }: { onCtaClick: () => void }) => (
  <div className="py-16 text-center bg-muted rounded-lg">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="container mx-auto px-4"
    >
      <h2 className="text-3xl font-bold">You're Ready to Go!</h2>
      <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
        Congratulations! You've covered the fundamentals of how APIs work. Now it's time to put your knowledge into practice in the sandbox.
      </p>
      <Button size="lg" className="mt-8" onClick={onCtaClick}>
        Go to the Sandbox <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </motion.div>
  </div>
);


export function LearnApiPage() {
  const router = useRouter();
  
  const handleBackToSandbox = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={handleBackToSandbox}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sandbox
          </Button>
          <h1 className="text-xl md:text-2xl font-bold text-primary hidden sm:block">API Learning Center</h1>
          <div />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
            <HeroSection />
            <PrerequisitesSection />
            <ApiFundamentalsSection />
            <InteractiveDiscoverySection />
            <AnatomyOfRequestSection />
            <RequestStructureSection />
            <ResponseAnatomySection />
            <AuthenticationSection />
            <ConclusionSection onCtaClick={handleBackToSandbox} />
        </div>
      </main>

      <ApiChatbot />
    </div>
  );
}
