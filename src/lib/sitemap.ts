import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Dynamic sitemap generation utilities
 * Generates sitemap based on hospitals and doctors
 */

export interface SitemapUrl {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

/**
 * Generate sitemap URLs for hospitals
 * @returns Array of hospital sitemap URLs
 */
export async function generateHospitalSitemapUrls(): Promise<SitemapUrl[]> {
  try {
    const hospitals = await prisma.hospital.findMany({
      where: {
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        updatedAt: true,
      },
    });

    return hospitals.map(hospital => ({
      url: `/hospitals/${hospital.id}`,
      lastModified: hospital.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generating hospital sitemap URLs:', error);
    return [];
  }
}

/**
 * Generate sitemap URLs for doctors
 * @returns Array of doctor sitemap URLs
 */
export async function generateDoctorSitemapUrls(): Promise<SitemapUrl[]> {
  try {
    const doctors = await prisma.doctor.findMany({
      where: {
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        updatedAt: true,
      },
    });

    return doctors.map(doctor => ({
      url: `/doctors/${doctor.id}`,
      lastModified: doctor.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error generating doctor sitemap URLs:', error);
    return [];
  }
}

/**
 * Generate sitemap URLs for specializations
 * @returns Array of specialization sitemap URLs
 */
export async function generateSpecializationSitemapUrls(): Promise<SitemapUrl[]> {
  try {
    const specializations = await prisma.specialization.findMany({
      where: {
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        updatedAt: true,
      },
    });

    return specializations.map(specialization => ({
      url: `/specializations/${specialization.id}`,
      lastModified: specialization.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error generating specialization sitemap URLs:', error);
    return [];
  }
}

/**
 * Generate static sitemap URLs
 * @returns Array of static sitemap URLs
 */
export function generateStaticSitemapUrls(): SitemapUrl[] {
  const now = new Date();
  
  return [
    {
      url: '/',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: '/hospitals',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: '/doctors',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: '/specializations',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: '/about',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: '/contact',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: '/privacy',
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: '/terms',
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}

/**
 * Generate complete sitemap XML
 * @returns Sitemap XML string
 */
export async function generateSitemapXml(): Promise<string> {
  try {
    const staticUrls = generateStaticSitemapUrls();
    const hospitalUrls = await generateHospitalSitemapUrls();
    const doctorUrls = await generateDoctorSitemapUrls();
    const specializationUrls = await generateSpecializationSitemapUrls();

    const allUrls = [
      ...staticUrls,
      ...hospitalUrls,
      ...doctorUrls,
      ...specializationUrls,
    ];

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${baseUrl}${url.url}</loc>
    <lastmod>${url.lastModified.toISOString()}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return sitemapXml;
  } catch (error) {
    console.error('Error generating sitemap XML:', error);
    throw error;
  }
}

/**
 * Generate robots.txt content
 * @returns Robots.txt string
 */
export function generateRobotsTxt(): string {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /login/
Disallow: /register/

# Allow public routes
Allow: /hospitals/
Allow: /doctors/
Allow: /specializations/
`;
}

/**
 * Generate sitemap index XML (for multiple sitemaps)
 * @returns Sitemap index XML string
 */
export function generateSitemapIndexXml(): string {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const now = new Date();

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${now.toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-hospitals.xml</loc>
    <lastmod>${now.toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-doctors.xml</loc>
    <lastmod>${now.toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-specializations.xml</loc>
    <lastmod>${now.toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;
}

/**
 * Generate hospital-specific sitemap XML
 * @returns Hospital sitemap XML string
 */
export async function generateHospitalSitemapXml(): Promise<string> {
  try {
    const hospitalUrls = await generateHospitalSitemapUrls();
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${hospitalUrls.map(url => `  <url>
    <loc>${baseUrl}${url.url}</loc>
    <lastmod>${url.lastModified.toISOString()}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return sitemapXml;
  } catch (error) {
    console.error('Error generating hospital sitemap XML:', error);
    throw error;
  }
}

/**
 * Generate doctor-specific sitemap XML
 * @returns Doctor sitemap XML string
 */
export async function generateDoctorSitemapXml(): Promise<string> {
  try {
    const doctorUrls = await generateDoctorSitemapUrls();
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${doctorUrls.map(url => `  <url>
    <loc>${baseUrl}${url.url}</loc>
    <lastmod>${url.lastModified.toISOString()}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return sitemapXml;
  } catch (error) {
    console.error('Error generating doctor sitemap XML:', error);
    throw error;
  }
}

/**
 * Generate specialization-specific sitemap XML
 * @returns Specialization sitemap XML string
 */
export async function generateSpecializationSitemapXml(): Promise<string> {
  try {
    const specializationUrls = await generateSpecializationSitemapUrls();
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${specializationUrls.map(url => `  <url>
    <loc>${baseUrl}${url.url}</loc>
    <lastmod>${url.lastModified.toISOString()}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return sitemapXml;
  } catch (error) {
    console.error('Error generating specialization sitemap XML:', error);
    throw error;
  }
}
