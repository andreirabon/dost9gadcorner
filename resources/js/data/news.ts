export interface NewsItem {
    id: number;
    title: string;
    date: string; // Maps to 'created_at' or 'published_at' (formatted as string from backend)
    summary: string; // Maps to 'excerpt' or 'summary' column
    content: string; // Maps to 'body' or 'content' column (stores HTML)
    image?: string; // Maps to 'image_path' or 'featured_image' column
}

/**
 * Future Database Schema Recommendation (MySQL/Laravel):
 * Table: `news` or `posts`
 * - id: bigint unsigned primary key
 * - title: varchar(255)
 * - summary: text
 * - content: longtext (stores the HTML string)
 * - image_path: varchar(255) nullable
 * - published_at: datetime (formatted to 'date' string in API Resource)
 * - created_at: timestamp
 * - updated_at: timestamp
 */

export const newsUpdates: NewsItem[] = [
    {
        id: 1,
        title: 'Women in Tech: Bridging the Digital Divide',
        date: 'November 20, 2025',
        summary: 'A workshop aimed at empowering women with essential digital skills to thrive in the modern technology landscape.',
        content: `
            <p class="mb-4">In an effort to bridge the gender gap in the technology sector, the Department of Science and Technology (DOST) Region IX organized a comprehensive workshop titled "Women in Tech: Bridging the Digital Divide." The event, held at the Zamboanga City Innovation Hub, brought together over 50 women from various backgrounds, including students, entrepreneurs, and professionals.</p>
            <p class="mb-4">The workshop focused on equipping participants with essential digital skills, ranging from basic computer literacy to more advanced topics such as coding, digital marketing, and data analysis. Expert speakers from the tech industry shared their insights and experiences, inspiring the attendees to pursue careers in STEM fields.</p>
            <p class="mb-4">"Empowering women with digital skills is not just about equality; it's about unlocking the full potential of our workforce," said Regional Director Martin Wee. "When women have access to technology and the skills to use it, they can contribute significantly to innovation and economic growth."</p>
            <p>The event concluded with a networking session, allowing participants to connect with mentors and peers. DOST IX plans to conduct follow-up sessions and advanced training programs to ensure sustainable impact.</p>
        `,
        image: '/svg/development1.svg',
    },
    {
        id: 2,
        title: 'Gender Sensitivity Training for Local Leaders',
        date: 'November 15, 2025',
        summary: 'Local community leaders participated in a comprehensive training session to promote gender-inclusive governance.',
        content: `
            <p class="mb-4">To foster a more inclusive and gender-responsive governance structure, DOST IX conducted a "Gender Sensitivity Training for Local Leaders" in Dipolog City. The training was attended by barangay captains, councilors, and community organizers from across the province.</p>
            <p class="mb-4">The session covered key concepts of gender and development (GAD), legal mandates, and practical strategies for integrating gender perspectives into local planning and budgeting. Facilitators emphasized the importance of recognizing and addressing the distinct needs of men and women in community development projects.</p>
            <p class="mb-4">Participants engaged in interactive workshops and role-playing exercises to identify gender biases and develop solutions for creating safer and more equitable communities. "This training has opened my eyes to the subtle ways gender inequality manifests in our daily work," shared one participant. "I am committed to applying these learnings to serve my constituents better."</p>
            <p>This initiative is part of DOST IX's broader commitment to mainstreaming GAD in all its programs and services.</p>
        `,
        image: '/svg/huddletogether_flat.svg',
    },
    {
        id: 3,
        title: 'Livelihood Program Launch for Rural Women',
        date: 'November 10, 2025',
        summary: 'New sustainable livelihood initiatives were launched to support economic independence for women in rural areas.',
        content: `
            <p class="mb-4">DOST IX launched a new livelihood program designed to uplift the economic status of women in rural areas of Zamboanga Sibugay. The program, dubbed "Empowering Rural Women through Science and Technology," aims to provide sustainable income-generating opportunities through technology transfer and skills training.</p>
            <p class="mb-4">Beneficiaries were introduced to various technologies such as food processing, handicraft making, and urban gardening. The program also includes the provision of starter kits and equipment to help the women set up their own small businesses.</p>
            <p class="mb-4">"Economic independence is a crucial step towards empowerment," stated the GAD Focal Person. "By providing these women with the tools and knowledge to earn their own income, we are helping them gain a voice in their households and communities."</p>
            <p>The launch event featured success stories from previous beneficiaries, showcasing the transformative power of S&T-based livelihood interventions.</p>
        `,
        image: '/svg/cest.jpg',
    },
    {
        id: 4,
        title: "Celebrating International Women's Month",
        date: 'March 8, 2025',
        summary: 'Highlights from our month-long celebration honoring the achievements and contributions of women worldwide.',
        content: `
            <p class="mb-4">March marks the celebration of International Women's Month, and DOST IX joined the global community in honoring the achievements and contributions of women. The month-long celebration featured a series of events, including webinars, recognition ceremonies, and outreach activities.</p>
            <p class="mb-4">One of the highlights was the "Women in Science" forum, where accomplished female scientists and researchers shared their journeys and challenges. The forum aimed to inspire young girls to pursue careers in science and technology.</p>
            <p class="mb-4">The agency also recognized outstanding female employees who have demonstrated excellence and dedication in their service. "We celebrate the resilience, intelligence, and leadership of women everywhere," said the Regional Director during the culminating activity.</p>
            <p>Throughout the month, purple ribbons and streamers adorned the DOST IX offices, symbolizing solidarity with the global movement for gender equality.</p>
        `,
        image: '/svg/man&woman.svg',
    },
    {
        id: 5,
        title: 'Scholarships for Women in STEM Announced',
        date: 'February 14, 2025',
        summary: 'New scholarship opportunities are now available for women pursuing degrees in Science, Technology, Engineering, and Mathematics.',
        content: `
            <p class="mb-4">In a bid to increase female representation in STEM fields, DOST-SEI announced the opening of new scholarship slots specifically for women. The "Women in STEM Scholarship Program" offers full tuition support, monthly stipends, and book allowances to deserving female students pursuing degrees in Science, Technology, Engineering, and Mathematics.</p>
            <p class="mb-4">"We need more women in science," declared the Scholarship Division Chief. "Diversity drives innovation, and by supporting women in STEM, we are investing in a brighter and more inclusive future for our country."</p>
            <p class="mb-4">The application period is open until the end of April 2025. Interested applicants are encouraged to visit the DOST-SEI website for more details and requirements.</p>
            <p>This initiative aligns with the United Nations Sustainable Development Goal 5: Gender Equality, and Goal 4: Quality Education.</p>
        `,
        image: '/svg/development2.svg',
    },
    {
        id: 6,
        title: 'Community Health Awareness Drive',
        date: 'January 25, 2025',
        summary: 'A successful health drive providing free check-ups and seminars on reproductive health and wellness for families.',
        content: `
            <p class="mb-4">DOST IX, in partnership with the Department of Health, conducted a Community Health Awareness Drive in a remote barangay in Zamboanga del Norte. The activity aimed to provide essential health services and information to underserved families.</p>
            <p class="mb-4">The health drive included free medical check-ups, distribution of vitamins, and seminars on reproductive health, maternal care, and nutrition. Special attention was given to the health needs of women and children.</p>
            <p class="mb-4">"Health is a fundamental human right," said the Medical Officer. "Through this drive, we hope to empower families with the knowledge and resources to take charge of their health and well-being."</p>
            <p>Over 200 residents benefited from the services provided. The activity is part of the agency's corporate social responsibility and GAD advocacy.</p>
        `,
        image: '/svg/setup1.svg',
    },
    {
        id: 7,
        title: 'Youth Leadership Summit 2025',
        date: 'January 10, 2025',
        summary: 'Empowering the next generation of leaders with workshops on gender equality, leadership, and social responsibility.',
        content: `
            <p class="mb-4">The Youth Leadership Summit 2025 gathered over 100 student leaders from various universities and colleges in the region. The summit, themed "Youth for Equality and Progress," aimed to cultivate a new generation of leaders who are gender-sensitive and socially responsible.</p>
            <p class="mb-4">The three-day event featured workshops on leadership development, gender sensitivity, project management, and community engagement. Participants were challenged to develop project proposals that address gender issues in their respective campuses.</p>
            <p class="mb-4">"The youth are the drivers of change," emphasized the Keynote Speaker. "By equipping you with the right values and skills, we are confident that you will lead us towards a more just and equitable society."</p>
            <p>The summit concluded with the signing of a pledge of commitment to promote gender equality and youth empowerment.</p>
        `,
        image: '/svg/huddletogether_layered.svg',
    },
    {
        id: 8,
        title: 'Launch of GAD Resource Center',
        date: 'December 15, 2024',
        summary: 'The official opening of our new resource center, providing access to books, research, and tools for gender advocacy.',
        content: `
            <p class="mb-4">DOST IX proudly inaugurated its new Gender and Development (GAD) Resource Center. The center serves as a hub for information and materials related to gender equality, women's empowerment, and GAD mainstreaming.</p>
            <p class="mb-4">The facility houses a collection of books, journals, research papers, and training modules. It also features a digital library and a meeting space for GAD focal persons and advocates.</p>
            <p class="mb-4">"This resource center is a testament to our commitment to continuous learning and advocacy," said the Regional Director. "We invite everyone to make use of these resources to deepen their understanding of GAD and contribute to our shared goals."</p>
            <p>The center is open to the public from Monday to Friday, 8:00 AM to 5:00 PM.</p>
        `,
        image: '/svg/reports.svg',
    },
];
