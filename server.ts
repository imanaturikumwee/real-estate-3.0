import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory + persistent fallback user store
interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'buyer' | 'tenant' | 'owner' | 'agent' | 'staff';
  passwordHash?: string;
  provider: 'local' | 'google' | 'apple' | 'github' | 'facebook';
  avatar?: string;
  createdAt: string;
}

// Initial demo users
const usersDb = new Map<string, UserRecord>([
  [
    'imanaturikumwee@gmail.com',
    {
      id: 'usr_imana',
      fullName: 'Imana Turikumwe',
      email: 'imanaturikumwee@gmail.com',
      phone: '+250 788 112 233',
      role: 'buyer',
      passwordHash: 'estate2024',
      provider: 'local',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date().toISOString(),
    },
  ],
  [
    'dany@emma-dany.rw',
    {
      id: 'usr_dany',
      fullName: 'Dany Mugisha',
      email: 'dany@emma-dany.rw',
      phone: '+250 788 123 456',
      role: 'staff',
      passwordHash: 'kigali2024',
      provider: 'local',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCtjmMQOY5sAAxNgQYW5ltoLNUo1kLKAdH1c6IzmD9AwmUbfTRMsN9e_K3Ft0MJTY8nv7PaPxe8ISn0cMPArCETMKbk7kdxSjiWPkeFVE2hAQ_ObZCyfzHuthpgvn5BnbSHTXLdSziG0EtQBiP3C8UMktBKjS7HTmvcziBajKSlA_9eraozrZiTDwCSD76913-r21ISJUQGLm45TbCKUatMhvrRAjHTg3eDWVw-Lyxgzr7ZA0zjy36EQ5xclzAjsdeTXyJ-V01YasjL',
      createdAt: new Date().toISOString(),
    },
  ],
]);

// Active sessions token map
const sessions = new Map<string, string>(); // token -> email

function generateToken(email: string): string {
  const token = 'est_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  sessions.set(token, email);
  return token;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // -------------------------------------------------------------
  // Backend Auth Endpoints
  // -------------------------------------------------------------

  // 1. Register User
  app.post('/api/auth/register', (req: Request, res: Response) => {
    try {
      const { fullName, email, phone, password, role } = req.body;

      if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Full name, email, and password are required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      if (usersDb.has(normalizedEmail)) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      const validRoles = ['buyer', 'tenant', 'owner', 'agent', 'staff'];
      const userRole = validRoles.includes(role) ? role : 'buyer';

      const newUser: UserRecord = {
        id: 'usr_' + Date.now().toString(36),
        fullName: fullName.trim(),
        email: normalizedEmail,
        phone: phone?.trim() || '+250 788 000 000',
        role: userRole,
        passwordHash: password, // In production, use bcrypt
        provider: 'local',
        createdAt: new Date().toISOString(),
      };

      usersDb.set(normalizedEmail, newUser);
      const token = generateToken(normalizedEmail);

      const { passwordHash, ...safeUser } = newUser;
      return res.status(201).json({
        message: 'Registration successful',
        user: safeUser,
        token,
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      return res.status(500).json({ error: 'Internal server error during registration.' });
    }
  });

  // 2. Sign In User
  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      let user = usersDb.get(normalizedEmail);

      // If user doesn't exist yet, allow quick first-time entry for ease of exploration
      if (!user) {
        // Automatically register standard user if testing
        const defaultRole = normalizedEmail.includes('agent') ? 'agent' : 'buyer';
        user = {
          id: 'usr_' + Date.now().toString(36),
          fullName: normalizedEmail.split('@')[0].replace('.', ' ').toUpperCase(),
          email: normalizedEmail,
          phone: '+250 788 000 000',
          role: defaultRole,
          passwordHash: password,
          provider: 'local',
          createdAt: new Date().toISOString(),
        };
        usersDb.set(normalizedEmail, user);
      } else if (user.passwordHash && user.passwordHash !== password) {
        return res.status(401).json({ error: 'Invalid credentials. Please verify your password.' });
      }

      const token = generateToken(normalizedEmail);
      const { passwordHash, ...safeUser } = user;

      return res.json({
        message: 'Sign in successful',
        user: safeUser,
        token,
      });
    } catch (err: any) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Internal server error during sign in.' });
    }
  });

  // 3. Current User Session Check
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ user: null });
    }

    const token = authHeader.split(' ')[1];
    const email = sessions.get(token);
    if (!email || !usersDb.has(email)) {
      return res.status(401).json({ user: null });
    }

    const user = usersDb.get(email)!;
    const { passwordHash, ...safeUser } = user;
    return res.json({ user: safeUser });
  });

  // 4. Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      sessions.delete(token);
    }
    return res.json({ message: 'Logged out successfully' });
  });

  // 5. Social Auth URL generator (Google, Apple, GitHub, Facebook)
  app.get('/api/auth/:provider/url', (req: Request, res: Response) => {
    const { provider } = req.params;
    const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/${provider}/callback`;

    // Standard provider endpoints or in-app dialog fallback
    const config: Record<string, { authUrl: string; clientId: string }> = {
      google: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        clientId: process.env.GOOGLE_CLIENT_ID || 'emma-dany-google-oauth-client',
      },
      apple: {
        authUrl: 'https://appleid.apple.com/auth/authorize',
        clientId: process.env.APPLE_CLIENT_ID || 'rw.emma-dany.estate.client',
      },
      github: {
        authUrl: 'https://github.com/login/oauth/authorize',
        clientId: process.env.GITHUB_CLIENT_ID || 'emma-dany-github-oauth',
      },
      facebook: {
        authUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
        clientId: process.env.FACEBOOK_CLIENT_ID || 'emma-dany-fb-client',
      },
    };

    const providerConfig = config[provider.toLowerCase()];
    if (!providerConfig) {
      return res.status(400).json({ error: `Unsupported auth provider: ${provider}` });
    }

    res.json({
      provider,
      clientId: providerConfig.clientId,
      redirectUri,
      url: `${providerConfig.authUrl}?client_id=${providerConfig.clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code`,
    });
  });

  // 6. Social Auth Callback (HTML postMessage payload for popup)
  app.get('/api/auth/:provider/callback', (req: Request, res: Response) => {
    const { provider } = req.params;
    const code = req.query.code || 'demo_auth_code_' + Date.now();

    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>${provider} Authentication</title></head>
        <body style="font-family: sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; background:#f8f9fa;">
          <div style="text-align:center;">
            <h3>Verifying ${provider.toUpperCase()} Credentials...</h3>
            <p>Please wait, redirecting to The Digital Estate...</p>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                type: 'OAUTH_AUTH_SUCCESS',
                provider: '${provider}',
                code: '${code}'
              }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
        </body>
      </html>
    `);
  });

  // 7. Social Login Direct Execution (Google, Apple, GitHub, Facebook)
  app.post('/api/auth/social-login', (req: Request, res: Response) => {
    try {
      const { provider, email, fullName, avatar, role } = req.body;

      if (!provider || !email) {
        return res.status(400).json({ error: 'Provider and email are required for social authentication.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      let user = usersDb.get(normalizedEmail);

      if (!user) {
        user = {
          id: `usr_${provider}_` + Date.now().toString(36),
          fullName: fullName?.trim() || `${provider.toUpperCase()} Patron`,
          email: normalizedEmail,
          phone: '+250 788 ' + Math.floor(100000 + Math.random() * 900000),
          role: role || 'buyer',
          provider: provider as any,
          avatar:
            avatar ||
            (provider === 'google'
              ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
              : provider === 'apple'
              ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
              : provider === 'github'
              ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
              : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'),
          createdAt: new Date().toISOString(),
        };
        usersDb.set(normalizedEmail, user);
      }

      const token = generateToken(normalizedEmail);
      const { passwordHash, ...safeUser } = user;

      return res.json({
        message: `Authenticated via ${provider}`,
        user: safeUser,
        token,
      });
    } catch (err: any) {
      console.error('Social login error:', err);
      return res.status(500).json({ error: 'Error processing social login.' });
    }
  });

  // 8. Forgot Password
  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const { email } = req.body;
    return res.json({
      message: `Password reset instructions have been dispatched to ${email || 'your address'}.`,
    });
  });

  // -------------------------------------------------------------
  // Property & Portfolio Management Endpoints
  // -------------------------------------------------------------

  // -------------------------------------------------------------
  // Property & Portfolio Management Endpoints
  // -------------------------------------------------------------

  // Favorites store
  const savedFavorites = new Set<string>(['horizon-residence', 'kivubelt-terraces']);

  // Inquiries store
  interface InquiryRecord {
    id: string;
    propertyId?: string;
    propertyTitle?: string;
    fullName: string;
    email: string;
    phone: string;
    date?: string;
    notes?: string;
    type: string;
    status: 'pending' | 'confirmed';
    createdAt: string;
  }
  const inquiriesDb: InquiryRecord[] = [
    {
      id: 'inq_demo_01',
      propertyId: 'horizon-residence',
      propertyTitle: 'The Horizon Residence',
      fullName: 'Imana Turikumwe',
      email: 'imanaturikumwee@gmail.com',
      phone: '+250 788 112 233',
      date: '2026-10-15',
      notes: 'Interested in private sunset viewing and title inspection.',
      type: 'Private VIP Tour',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    },
  ];

  // Curated base properties
  const baseProperties = [
    {
      id: 'horizon-residence',
      title: 'The Horizon Residence',
      neighborhood: 'Nyarutarama',
      location: 'Nyarutarama, Kigali',
      price: 850000,
      priceDisplay: '$850,000',
      rwfPriceDisplay: '45M RWF',
      propertyType: 'Villa',
      beds: 4,
      baths: 3,
      sqft: 3450,
      areaM2: 320,
      rating: 9.2,
      badge: 'Premium',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAiD5Sf302m49Cgl-HKJ79zbgX_vYXr14YiY-2H3w1VccGCbknMc7gsPFVsvebvnaikmFIG90qJYlxf5cweT_l07hr1Ks94IrIQDYBSVfly_gNdV5KkXfm8s6U0r9VUx5kNCOqfIkPuwwCCctJqszViRLSBD-TqllsHp4q-8YjDHRVnAJl-fbU9obyTN9vslCKCvAy5sDSQOoAYZ4tcgi7C5EQoHF6dHHUSCCfGb2ImYaiwBT0Jjq1dEHcc9D628oT78YCPzen7-Yaq',
      architecturalStyle: 'Contemporary Scandinavian-Rwandan Villa',
      description:
        'Masterfully positioned in prime Nyarutarama overlooking Kigali Golf Club. Features triple-pane floor-to-ceiling glass facades, custom hardwood louvers, heated pool, and private landscaped courtyard.',
      highlights: [
        'Walking distance to Kigali Golf Club and diplomatic residences',
        'Solar-integrated backup with dual Tesla powerwalls',
        'Italian porcelain tiles & Musanze volcanic stone cladding',
        '24/7 security patrol with smart biometric entry',
      ],
      zoning: 'R1A - Low Density Prime Residential',
      estimatedRentalYield: '10.2% annual yield (4.2M RWF/mo)',
      yearBuilt: 2024,
      parkingSpaces: 4,
      lotSize: '1,200 sqm',
      mapPin: { top: '38%', left: '42%', label: '45M', coordinates: { lat: -1.936, lng: 30.103 } },
      transitInfo: {
        destination: 'Nyarutarama Business Hub',
        walkingMins: 12,
        drivingMins: 4,
      },
    },
    {
      id: 'kivubelt-terraces',
      title: 'Kivubelt Terraces',
      neighborhood: 'Kibagabaga',
      location: 'Kibagabaga, Kigali',
      price: 620000,
      priceDisplay: '$620,000',
      rwfPriceDisplay: '32M RWF',
      propertyType: 'Duplex',
      beds: 3,
      baths: 2,
      sqft: 2260,
      areaM2: 210,
      rating: 8.8,
      badge: 'New Build',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA3c7xi4yWp-mUwDymmU9GsMcopSAfVtpXn2GdlW9qSNfVOwCN_J0CSzti3O2MVU8_1YQIzGG4_Ppuw8BZ9ncyUv9c_4ui885INoTF_1unkGcidonAAarpRbx9akUp2fSt-G7UBJNnjg95XVkRyoB3U7ObNOZk08c1lxAmm6k1DbtlpZUzFjrqX9enYM-X_XpDYTroRUWj0hkCubWyaLt3dwECeyn6Qkc11Ub8Z6yL1WllnO2yhZ7wwaZXiNLqA6bLObjGstvrGEXk2',
      architecturalStyle: 'Modern Terraced Hillside Townhome',
      description:
        'Perched on the rising ridgeline of Kibagabaga with panoramic views of the Kimironko valley. Open-concept double-height living room with private garden terrace and rooftop sunset pavilion.',
      highlights: [
        'Expansive rooftop entertainment deck with city lights panorama',
        'Ultra-efficient passive ventilation design',
        'Dedicated domestic staff quarters and covered carport',
        'High rental yield with international tech professionals',
      ],
      zoning: 'R2 - Medium Density Planned Community',
      estimatedRentalYield: '11.5% annual yield (3.1M RWF/mo)',
      yearBuilt: 2024,
      parkingSpaces: 2,
      lotSize: '650 sqm',
      mapPin: { top: '48%', left: '68%', label: '32M', coordinates: { lat: -1.944, lng: 30.125 } },
      transitInfo: {
        destination: 'Kigali Convention Centre',
        walkingMins: 22,
        drivingMins: 7,
      },
    },
    {
      id: 'nyarutarama-heights',
      title: 'Nyarutarama Heights',
      neighborhood: 'Nyarutarama',
      location: 'Nyarutarama, Kigali',
      price: 850000,
      priceDisplay: '$850,000',
      rwfPriceDisplay: '52M RWF',
      propertyType: 'Villa',
      beds: 5,
      baths: 4,
      sqft: 4200,
      areaM2: 390,
      rating: 9.6,
      badge: 'Premium Listing',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCUOhQL5jMcnbiwfsVMXu8wIJrtacsGdJmCc1cVFy-nc_HWacnpWp2iUct98HbBPMxx8L1q4FMktUDRKj-xLjvUUWWthqFE01CvpXMaLykGys6PXkk3HF7YtjM4Xp3GLOqJ0DWMvIMEfpsSOu0KunGp2lFZNnBY2hkLxxD67Q-S9__t5UCr3vnDLpVSt-8X9oq4UJvHy92eSyWm_NaDWL0oJsabAD117CG7-UQEZY4ouFRHLOGZh0WUaKHDyiVviz-lH40WEzrBIl4H',
      architecturalStyle: 'Modern Minimalist Villa with Infinity Pool',
      description:
        'Perched prominently in diplomatic Nyarutarama, this modernist residence combines expansive glass curtain walls with local Musanze volcanic basalt detailing.',
      highlights: [
        'Direct panoramic vistas of Kigali Golf Course',
        'Heated infinity pool with cantilevered sun deck',
        'Smart home automation and integrated greywater filtration',
      ],
      zoning: 'R1A - Low Density Prime Residential',
      estimatedRentalYield: '9.8% gross annual yield ($7,000/mo)',
      yearBuilt: 2024,
      parkingSpaces: 4,
      lotSize: '1,450 sqm',
      mapPin: { top: '34%', left: '46%', label: '52M', coordinates: { lat: -1.932, lng: 30.108 } },
      transitInfo: {
        destination: 'Kigali Golf Club',
        walkingMins: 5,
        drivingMins: 2,
      },
    },
    {
      id: 'vision-city-duplex',
      title: 'Vision City Duplex',
      neighborhood: 'Gacuhiro',
      location: 'Gacuhiro, Rwanda',
      price: 425000,
      priceDisplay: '$425,000',
      rwfPriceDisplay: '28M RWF',
      propertyType: 'Duplex',
      beds: 3,
      baths: 3,
      sqft: 2800,
      areaM2: 260,
      rating: 8.9,
      badge: 'Popular',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCFkv3aTYakD1H_X4UZmHAQ5ymG4msN8PxppnuxoNIyM3Iq8YJizoq9rSlR2zjlhTaYG9uHx-1qsuWLxwKSkI5e5TCsvPC2Kyj_3vYDvJaaTCzmHMai8RP6iBQqrnPVZF5CwVYychiNEUsyu4kduW_zRpk7KtOY6_-d0TLSnBAS3JyGoq-cYsRUvvNRY3ckapXE8R7RdcSvG2ZOQ90NmEjUkBY7JSnaxbMyx35BLy04aRqGzQZwAXGmwaQgFJ8cskamSxlY2C1t4ld3',
      architecturalStyle: 'Contemporary Geometric Terraces',
      description:
        'Engineered for flexible modern living within the gated enclave of Vision City in Gacuhiro. Multi-level terraced layout with bespoke European cabinetry.',
      highlights: [
        'Pristine community infrastructure with underground utility lines',
        'Fiber-optic connectivity and backup solar inverter',
      ],
      zoning: 'R2 - Medium Density Planned Community',
      estimatedRentalYield: '10.5% gross annual yield ($3,800/mo)',
      yearBuilt: 2023,
      parkingSpaces: 2,
      lotSize: '620 sqm',
      mapPin: { top: '25%', left: '60%', label: '28M', coordinates: { lat: -1.921, lng: 30.119 } },
      transitInfo: {
        destination: 'Vision City Hub',
        walkingMins: 8,
        drivingMins: 3,
      },
    },
    {
      id: 'hilltop-retreat',
      title: 'Hilltop Retreat',
      neighborhood: 'Rebero',
      location: 'Rebero, Rwanda',
      price: 1200000,
      priceDisplay: '$1,200,000',
      rwfPriceDisplay: '68M RWF',
      propertyType: 'Architectural Estate',
      beds: 6,
      baths: 5,
      sqft: 6500,
      areaM2: 600,
      rating: 9.8,
      badge: 'Exclusive',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDWkgzghzdmuld-W3wMbZ_o3gMjuSVvKU_KDM1BetkI5EiSEn9m-ZIn8m5c_cdDlT72YYrWmdnqZ-1kw9fFqimJEHeAwXyzHxwGkoHrdJ7V_GI4WBD6EXQedHE8qtdoXzjysdXg7kFbINO4ori8TOxHsvXitR1uR9X0huLLDH1nJFTkv5j2iDovGKnb4yxoO99CSrWrHb5NQYlzrQWjNJjpAzbhTy_7OEvvzDqJ-VfQjI4wLEQM1Uk--sdR5dJmRvMBpQePPjcqLskJ',
      architecturalStyle: 'Earthy Hillside Pavilion & Sustainable Timber',
      description:
        'Dominating the summit of Rebero hill with 360-degree vistas across the thousand hills and Kigali downtown skyline.',
      highlights: [
        '360° unobstructed city and rolling mountain panorama',
        'Wine cellar carved into natural basalt bedrock',
        'Infinity edge ozone-treated pool',
      ],
      zoning: 'R1 - Hilltop Low Density Conservation',
      estimatedRentalYield: '8.9% gross annual yield ($9,200/mo)',
      yearBuilt: 2024,
      parkingSpaces: 6,
      lotSize: '2,800 sqm',
      mapPin: { top: '65%', left: '35%', label: '68M', coordinates: { lat: -1.982, lng: 30.082 } },
      transitInfo: {
        destination: 'Kigali Financial District',
        walkingMins: 35,
        drivingMins: 11,
      },
    },
    {
      id: 'zen-pavilion',
      title: 'The Zen Pavilion',
      neighborhood: 'Kiyovu',
      location: 'Kiyovu, Rwanda',
      price: 960000,
      priceDisplay: '$960,000',
      rwfPriceDisplay: '58M RWF',
      propertyType: 'Villa',
      beds: 4,
      baths: 4,
      sqft: 4800,
      areaM2: 445,
      rating: 9.7,
      badge: 'Smart Match',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD2EM6jH0Hi1NNiDmQIIP7GwWjjAnOhldBUxbD_AnJYGN7d6tAG_KolV9u8fdOoQWCOklPneDd8SjID4_QjUr3A9gp1tyYCerCF5FRP31JbAXi1mijntzH2Ksv3t0gNhfLi45GWVXE8h_PFfLUGF0eh8teau-IlMEp_KNbWUb5t2ps-PlmrXgHiBKJKSAsJuUFmykwqUxO6Kj_0au1is72yYFknZnP5iOZyE-1ntZvw6JMiAbln8b0o4PYREBf5-zE6aYXV_dt5uSFW',
      architecturalStyle: 'Japanese-Rwandan Wabi-Sabi Fusion',
      description:
        'Located in quiet Old Kiyovu near embassies. Designed around an internal reflecting pool and central courtyard.',
      highlights: [
        'Floor-to-ceiling glass sliding partitions for indoor-outdoor flow',
        'Zero-VOC certified natural clay plaster and volcanic stone tiles',
        'High-security embassy quarter perimeter',
      ],
      zoning: 'R1 - Kiyovu Residential Heritage & Luxury',
      estimatedRentalYield: '9.2% gross annual yield ($7,500/mo)',
      yearBuilt: 2024,
      parkingSpaces: 3,
      lotSize: '1,200 sqm',
      mapPin: { top: '42%', left: '32%', label: '58M', coordinates: { lat: -1.956, lng: 30.064 } },
      transitInfo: {
        destination: 'Downtown Kigali',
        walkingMins: 10,
        drivingMins: 3,
      },
    },
    {
      id: 'sky-terrace-penthouse',
      title: 'Sky Terrace Penthouse',
      neighborhood: 'Kimihurura',
      location: 'Kimihurura, Rwanda',
      price: 680000,
      priceDisplay: '$680,000',
      rwfPriceDisplay: '39M RWF',
      propertyType: 'Penthouse',
      beds: 3,
      baths: 3,
      sqft: 3100,
      areaM2: 290,
      rating: 9.4,
      badge: 'High-Yield Asset',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCq22PAOj0R1YTr1O-EC4p76p4EoOl16sC3OZy5eNz6u_BPqWB-K54BNZ69O156ckYfgx_Ipm0e1eA02CzmbLCOH9YuTgXV0YWtbrmYyVbWAfMz3IRx1eroleA6GRGoVfw8mYM459NW0qwYUJI0Ik6xrUEgI-VsxGrBwiTbLfUT9i8z3bD9wKpagTPuy5ei24wqMsJu9Hn4IWpgRajHR1CBf3tiKjAmRR9HEX5-Fkb1V86S-HmrNiq-oVdJKUt_c5qVRJehfTosdz_H',
      architecturalStyle: 'High-Altitude Urban Modernism',
      description:
        'Hovering over Kimihurura’s culinary and diplomatic corridor with wraparound terrace capturing the illuminated Convention Centre.',
      highlights: [
        'Private rooftop hot tub overlooking the Convention Centre dome',
        'Direct elevator foyer with coded biometric access',
      ],
      zoning: 'C2 - Commercial Mixed Urban Corridor',
      estimatedRentalYield: '11.8% gross annual yield ($6,500/mo)',
      yearBuilt: 2023,
      parkingSpaces: 2,
      lotSize: '310 sqm floorplate',
      mapPin: { top: '55%', left: '55%', label: '39M', coordinates: { lat: -1.954, lng: 30.089 } },
      transitInfo: {
        destination: 'Kigali Convention Centre',
        walkingMins: 7,
        drivingMins: 2,
      },
    },
  ];

  // Custom listed properties store
  const customProperties: any[] = [];

  // Helper to get all combined properties
  function getAllProperties() {
    return [...customProperties, ...baseProperties];
  }

  // 1. Search & Filter Properties with multi-criteria support
  app.get('/api/properties/search', (req: Request, res: Response) => {
    try {
      const {
        q,
        query,
        district,
        type,
        propertyType,
        minPrice,
        maxPrice,
        beds,
        sortBy = 'featured',
      } = req.query;

      const searchTerm = ((q || query || '') as string).trim().toLowerCase();
      const targetDistrict = ((district || '') as string).trim();
      const targetType = ((type || propertyType || '') as string).trim();
      const minP = minPrice ? Number(minPrice) : 0;
      const maxP = maxPrice ? Number(maxPrice) : Infinity;
      const minBeds = beds ? Number(beds) : 0;

      let results = getAllProperties().filter((item) => {
        // District filter
        if (targetDistrict && targetDistrict !== 'All Districts' && targetDistrict !== 'All') {
          if (!item.neighborhood.toLowerCase().includes(targetDistrict.toLowerCase())) {
            return false;
          }
        }

        // Property Type filter
        if (targetType && targetType !== 'All Types' && targetType !== 'All') {
          if (item.propertyType.toLowerCase() !== targetType.toLowerCase()) {
            return false;
          }
        }

        // Price range filter
        if (item.price < minP || item.price > maxP) {
          return false;
        }

        // Bedrooms filter
        if (minBeds > 0 && item.beds < minBeds) {
          return false;
        }

        // Search text
        if (searchTerm) {
          const matchTitle = item.title.toLowerCase().includes(searchTerm);
          const matchNeighborhood = item.neighborhood.toLowerCase().includes(searchTerm);
          const matchStyle = item.architecturalStyle.toLowerCase().includes(searchTerm);
          const matchDesc = item.description.toLowerCase().includes(searchTerm);
          if (!matchTitle && !matchNeighborhood && !matchStyle && !matchDesc) {
            return false;
          }
        }

        return true;
      });

      // Sorting
      results.sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'sqft') return b.sqft - a.sqft;
        if (sortBy === 'yield') {
          const yA = parseFloat(a.estimatedRentalYield) || 0;
          const yB = parseFloat(b.estimatedRentalYield) || 0;
          return yB - yA;
        }
        return (b.rating || 0) - (a.rating || 0);
      });

      // Augment with isFavorite flag
      const enriched = results.map((p) => ({
        ...p,
        isFavorite: savedFavorites.has(p.id),
      }));

      return res.json({
        success: true,
        total: enriched.length,
        properties: enriched,
        favoritesCount: savedFavorites.size,
      });
    } catch (err: any) {
      console.error('Search error:', err);
      return res.status(500).json({ error: 'Search failed' });
    }
  });

  // 2. Map Pins Endpoint (lightweight coordinates for Kigali Map canvas)
  app.get('/api/properties/map-pins', (_req: Request, res: Response) => {
    const pins = getAllProperties().map((p) => ({
      id: p.id,
      title: p.title,
      neighborhood: p.neighborhood,
      price: p.price,
      priceDisplay: p.priceDisplay,
      rwfPriceDisplay: p.rwfPriceDisplay,
      propertyType: p.propertyType,
      image: p.image,
      beds: p.beds,
      baths: p.baths,
      mapPin: p.mapPin,
      isFavorite: savedFavorites.has(p.id),
    }));
    return res.json({ success: true, pins });
  });

  // 3. Saved Favorites
  app.get('/api/properties/saved', (_req: Request, res: Response) => {
    const saved = getAllProperties()
      .filter((p) => savedFavorites.has(p.id))
      .map((p) => ({ ...p, isFavorite: true }));
    return res.json({
      success: true,
      total: saved.length,
      savedIds: Array.from(savedFavorites),
      properties: saved,
    });
  });

  // 4. Single Property Detail
  app.get('/api/properties/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const property = getAllProperties().find((p) => p.id === id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    return res.json({
      success: true,
      property: {
        ...property,
        isFavorite: savedFavorites.has(property.id),
      },
    });
  });

  // 5. Inquiries / VIP Tour Booking
  app.post('/api/inquiries', (req: Request, res: Response) => {
    try {
      const { propertyId, propertyTitle, fullName, email, phone, date, notes, type } = req.body;
      if (!fullName || !email || !phone) {
        return res.status(400).json({ error: 'Full name, email, and phone are required.' });
      }

      const newInquiry: InquiryRecord = {
        id: 'inq_' + Date.now().toString(36),
        propertyId,
        propertyTitle,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        date: date || new Date().toISOString().split('T')[0],
        notes: notes?.trim() || '',
        type: type || 'Private VIP Tour',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      inquiriesDb.unshift(newInquiry);

      return res.status(201).json({
        success: true,
        message: 'Your private VIP tour has been scheduled with Emma & Dany advisors.',
        inquiry: newInquiry,
        confirmationCode: 'RW-VIP-' + Math.floor(1000 + Math.random() * 9000),
      });
    } catch (err: any) {
      console.error('Inquiry error:', err);
      return res.status(500).json({ error: 'Failed to record tour request.' });
    }
  });

  // 6. Get all properties (legacy compatibility)
  app.get('/api/properties', (_req: Request, res: Response) => {
    res.json({
      success: true,
      favorites: Array.from(savedFavorites),
      customProperties,
      total: getAllProperties().length,
    });
  });

  // 7. Add a newly listed property
  app.post('/api/properties', (req: Request, res: Response) => {
    try {
      const {
        title,
        neighborhood,
        price,
        priceDisplay,
        rwfPriceDisplay,
        propertyType,
        beds,
        baths,
        areaM2,
        image,
        description,
      } = req.body;

      if (!title || !neighborhood) {
        return res.status(400).json({ error: 'Title and neighborhood are required.' });
      }

      const newEstate = {
        id: 'estate_' + Date.now().toString(36),
        title: title.trim(),
        neighborhood: neighborhood.trim(),
        location: `${neighborhood.trim()}, Kigali`,
        price: Number(price) || 500000,
        priceDisplay: priceDisplay || `$${Number(price || 500000).toLocaleString()}`,
        rwfPriceDisplay: rwfPriceDisplay || `${Math.round((Number(price) || 500000) / 18000)}M RWF`,
        propertyType: propertyType || 'Villa',
        beds: Number(beds) || 3,
        baths: Number(baths) || 2,
        sqft: (Number(areaM2) || 250) * 10.76,
        areaM2: Number(areaM2) || 250,
        rating: 9.0,
        badge: 'Newly Listed',
        image:
          image ||
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAiD5Sf302m49Cgl-HKJ79zbgX_vYXr14YiY-2H3w1VccGCbknMc7gsPFVsvebvnaikmFIG90qJYlxf5cweT_l07hr1Ks94IrIQDYBSVfly_gNdV5KkXfm8s6U0r9VUx5kNCOqfIkPuwwCCctJqszViRLSBD-TqllsHp4q-8YjDHRVnAJl-fbU9obyTN9vslCKCvAy5sDSQOoAYZ4tcgi7C5EQoHF6dHHUSCCfGb2ImYaiwBT0Jjq1dEHcc9D628oT78YCPzen7-Yaq',
        gallery: [
          image ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAiD5Sf302m49Cgl-HKJ79zbgX_vYXr14YiY-2H3w1VccGCbknMc7gsPFVsvebvnaikmFIG90qJYlxf5cweT_l07hr1Ks94IrIQDYBSVfly_gNdV5KkXfm8s6U0r9VUx5kNCOqfIkPuwwCCctJqszViRLSBD-TqllsHp4q-8YjDHRVnAJl-fbU9obyTN9vslCKCvAy5sDSQOoAYZ4tcgi7C5EQoHF6dHHUSCCfGb2ImYaiwBT0Jjq1dEHcc9D628oT78YCPzen7-Yaq',
        ],
        architecturalStyle: 'Modern Contemporary Kigali Living',
        description: description || 'Prime architectural residence listed on The Digital Estate platform.',
        highlights: ['Verified land registry status', 'Prime Kigali road access', 'High residential yield area'],
        zoning: 'R1A - Low Density Prime Residential',
        estimatedRentalYield: '10.0% p.a.',
        yearBuilt: 2024,
        parkingSpaces: 2,
        lotSize: '800 sqm',
        mapPin: {
          top: `${35 + Math.floor(Math.random() * 25)}%`,
          left: `${40 + Math.floor(Math.random() * 25)}%`,
          label: rwfPriceDisplay?.split(' ')[0] || '40M',
          coordinates: { lat: -1.945, lng: 30.1 },
        },
        transitInfo: {
          destination: 'Kigali City Center',
          walkingMins: 15,
          drivingMins: 5,
        },
        createdAt: new Date().toISOString(),
      };

      customProperties.unshift(newEstate);
      return res.status(201).json({ success: true, estate: newEstate });
    } catch (e: any) {
      console.error('List property error:', e);
      return res.status(500).json({ error: 'Failed to list property.' });
    }
  });

  // 8. Toggle favorite property
  app.post('/api/properties/:id/favorite', (req: Request, res: Response) => {
    const { id } = req.params;
    let isFav = false;
    if (savedFavorites.has(id)) {
      savedFavorites.delete(id);
      isFav = false;
    } else {
      savedFavorites.add(id);
      isFav = true;
    }
    res.json({ success: true, id, isFavorite: isFav, totalFavorites: savedFavorites.size });
  });

  // 9. Portfolio statistics
  app.get('/api/portfolio', (_req: Request, res: Response) => {
    res.json({
      portfolioValueRwf: '142M RWF',
      portfolioValueUsd: '$1,890,000',
      totalHoldings: 3,
      grossYield: '10.8%',
      monthlyIncome: '12.4M RWF',
      occupancyRate: '98%',
    });
  });

  // -------------------------------------------------------------
  // Vite Integration
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Emma & Dany Luxury Realty] Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
