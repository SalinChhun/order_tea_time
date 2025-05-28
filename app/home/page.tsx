'use client';

import {Suspense, useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import HomePageContent from "@/app/ui/HomePageContent";

interface TelegramUser {
    id: string;
    firstName: string;
    lastName?: string;
    username?: string;
    chatId: string;
}

interface SessionData {
    success: boolean;
    user: TelegramUser;
    sessionId: string;
}

export default function HomePage() {
    <Suspense
        fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading your session...</p>
                </div>
            </div>
        }
    >
        <HomePageContent/>
    </Suspense>
}