import React, { useState } from 'react';

export const SupportView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      
      {/* Support Hero Card with Image Background */}
      <div style={{
        background: "#F4F1EA url('/uploads/dashboard/support-hero-seession-image.png') center/cover no-repeat",
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '16px',
        border: '1px solid #E5E0D6',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}>
        <div style={{ maxWidth: '60%' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(139, 35, 50, 0.12)',
            color: '#8B2332',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            SUPPORT & HELP
          </div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: 700, color: '#0D3B34', margin: '0', lineHeight: 1.2 }}>
            We’re here to help.
          </h2>
        </div>
      </div>

      {/* WhatsApp Support Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '12px',
        border: '1px solid #ECE5DB',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
        display: 'flex',
        gap: '14px',
        alignItems: 'center'
      }}>
        <div style={{
          background: '#7A1F2C',
          width: '64px',
          height: '64px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <img src="/uploads/suuport/pranam-software icon.png" alt="Pranam Software Logo" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#8B2332', fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '2px' }}>
            CONTACT SUPPORT
          </div>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '16px', fontWeight: 700, color: '#0D3B34', margin: '0 0 6px 0' }}>
            WhatsApp Support
          </h3>
          <a
            href="https://wa.me/9779823415625"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#7A1F2C',
              color: '#FFFFFF',
              padding: '7px 16px',
              borderRadius: '999px',
              textDecoration: 'none',
              fontSize: '11px',
              fontWeight: 600,
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.6 6.3C16 4.7 13.9 3.9 11.7 3.9C7.2 3.9 3.6 7.5 3.6 12C3.6 13.4 3.9 14.8 4.5 16L3.5 20.1L7.7 19.1C8.9 19.7 10.3 20 11.7 20C16.2 20 19.8 16.4 19.8 11.9C19.8 9.7 19.1 7.6 17.6 6.3M11.7 18.8C10.5 18.8 9.4 18.5 8.4 18L8.1 17.8L5.3 18.5L6 15.8L5.8 15.5C5.2 14.5 4.9 13.3 4.9 12C4.9 8.4 7.9 5.4 11.5 5.4C13.4 5.4 15.2 6.1 16.5 7.4C17.8 8.7 18.5 10.5 18.5 12.4C18.5 16 15.5 18.8 11.7 18.8M15.3 13.5C15.1 13.4 14.6 13.1 14.5 13C14.3 12.9 14.2 12.9 14 13.1C13.8 13.3 13.3 13.9 13.1 14.1C13 14.2 12.8 14.2 12.6 14.1C12.4 14 11.8 13.8 11 13.1C10.4 12.5 10 11.8 9.8 11.6C9.7 11.4 9.8 11.3 9.9 11.1C10 11 10.1 10.8 10.3 10.7C10.4 10.5 10.5 10.4 10.6 10.2C10.8 10 10.7 9.8 10.6 9.7C10.5 9.6 9.9 8.4 9.7 7.9C9.5 7.5 9.3 7.5 9.1 7.5C8.9 7.5 8.8 7.5 8.6 7.5C8.4 7.5 8.1 7.6 7.9 7.8C7.7 8 7.1 8.6 7.1 9.8C7.1 11 7.9 12.1 8.1 12.3C8.2 12.5 10 15.1 12.7 16.1C13.3 16.3 13.8 16.5 14.2 16.6C14.8 16.8 15.4 16.8 15.9 16.7C16.4 16.6 17.4 16.1 17.6 15.5C17.8 14.9 17.8 14.4 17.7 14.3C17.6 14.1 17.5 14.1 17.3 14C17.1 14 16.5 13.7 15.3 13.5Z" fill="white"/>
            </svg>
            Chat on WhatsApp &nbsp;→
          </a>
        </div>
      </div>

      {/* User Guide Card */}
      <div
        onClick={() => setIsModalOpen(true)}
        style={{
          background: '#F7F4EE',
          borderRadius: '20px',
          padding: '16px',
          marginBottom: '16px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          border: '1px solid #ECE5DB',
          cursor: 'pointer'
        }}
      >
        <div style={{ width: '52px', height: '52px', background: '#E8E2D6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#0D3B34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#0D3B34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#8B2332', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '3px' }}>DOCUMENTATION</div>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '16px', fontWeight: 700, color: '#0D3B34', margin: '0 0 3px 0' }}>User Guide</h3>
          <p style={{ fontSize: '12px', color: '#58746E', margin: 0 }}>Learn how to use the admin panel with our documentation.</p>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginLeft: '8px' }}>
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#0D3B34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* About Card */}
      <div style={{ background: '#F7F4EE', borderRadius: '20px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', border: '1px solid #ECE5DB' }}>
        <div style={{ width: '52px', height: '52px', background: '#E8E2D6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#0D3B34" strokeWidth="2"/>
            <line x1="12" y1="16" x2="12" y2="12" stroke="#0D3B34" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="8" x2="12.01" y2="8" stroke="#0D3B34" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#8B2332', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '3px' }}>ABOUT</div>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '16px', fontWeight: 700, color: '#0D3B34', margin: '0 0 3px 0' }}>Chiya Tale Admin Panel v1.0</h3>
          <p style={{ fontSize: '12px', color: '#58746E', margin: 0 }}>Powered by Pranam Software</p>
        </div>
      </div>

      {/* User Guide Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFFDF9', borderRadius: '24px', maxWidth: '520px', width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '28px 24px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', border: '1px solid #ECE5DB' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', background: '#F4EFE6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7A1F2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: 700, color: '#0D3B34', margin: 0 }}>Admin Panel User Guide</h2>
                  <p style={{ fontSize: '11px', color: '#58746E', margin: 0 }}>Step-by-step instructions for managing Chiya Tale</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#58746E' }}>&times;</button>
            </div>

            <div style={{ borderTop: '1px solid #ECE5DB', paddingTop: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '28px', height: '28px', background: '#7A1F2C', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>1</div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0D3B34', margin: '0 0 4px 0' }}>Editing Menu Items & Prices</h4>
                  <p style={{ fontSize: '12px', color: '#58746E', margin: 0, lineHeight: 1.4 }}>Open Menu Items tab, select a Category, edit names/prices, and click Save Items.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '28px', height: '28px', background: '#7A1F2C', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>2</div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0D3B34', margin: '0 0 4px 0' }}>Managing Categories & Image Uploads</h4>
                  <p style={{ fontSize: '12px', color: '#58746E', margin: 0, lineHeight: 1.4 }}>Open Categories tab to add/delete categories, upload images to Cloudinary, and save.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '28px', height: '28px', background: '#7A1F2C', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>3</div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0D3B34', margin: '0 0 4px 0' }}>Header Taglines & Branding</h4>
                  <p style={{ fontSize: '12px', color: '#58746E', margin: 0, lineHeight: 1.4 }}>Open Header Settings tab to customize tagline, café title, and location text.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '28px', height: '28px', background: '#7A1F2C', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>4</div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0D3B34', margin: '0 0 4px 0' }}>Changing Password & Security</h4>
                  <p style={{ fontSize: '12px', color: '#58746E', margin: 0, lineHeight: 1.4 }}>Open Change Password tab, enter current and new password, and click Update Password.</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ background: '#7A1F2C', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '999px', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>Got It!</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
