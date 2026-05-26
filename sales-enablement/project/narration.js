/* Sales Training — Narration & Auto-advance Engine
 * Uses the browser SpeechSynthesis API for live audio narration.
 * Controls live in a fixed bar outside the slide canvas so the slide
 * layout is preserved exactly as authored.
 */

(function () {
  // Narration scripts — base64 encoded so they don't appear in plain text in source.
  // Decoded at runtime and fed straight to SpeechSynthesis; never injected into the DOM.
  const _S = [
    "V2VsY29tZSwgdGVhbS4gQmVmb3JlIHdlIGRpdmUgaW50byB0aGUgZGVlcC1yb290ZWQgcHN5Y2hvbG9naWNhbCBkeW5hbWljcyBvZiBzYWxlcyDigJQgbGV0J3MgZXN0YWJsaXNoIG91ciBmb3VuZGF0aW9uLiBUaGlzIHNlc3Npb24gaXMgZGVzaWduZWQgdG8gZmVhcmxlc3NseSBleHBsb3JlIHRoZSBldm9sdXRpb24gb2YgcGVyc3Vhc2lvbi4gRnJvbSBhbmNpZW50IG5hcnJhdGl2ZXMuIEFsbCB0aGUgd2F5LCB0byB0aGUgbW9kZXJuLCBBLkkuIGZpcnN0IGVudmlyb25tZW50cyB3ZSBvcGVyYXRlIGluIHRvZGF5LiBBcyB0aGUgc2F5aW5nIGdvZXMuIEdyZWF0IHRoaW5ncyBpbiBidXNpbmVzcywgYXJlIG5ldmVyIGRvbmUgYnkgb25lIHBlcnNvbi4gVGhleSBhcmUgZG9uZS4gQnkgYSB0ZWFtIG9mIHBlb3BsZS4gQW5kIHRoYXQgaXMgZXhhY3RseSB3aGF0IHRoaXMgc2Vzc2lvbiBpcyBhYm91dC4gQWxpZ25pbmcgYWxsIG9mIHVzLiBBcyBvbmUgdGVhbS4gT24gdGhlIHRpbWVsZXNzIG1lY2hhbmljcywgb2YgaG93IGh1bWFuIGJlaW5ncyBidXkuIFRocmVlIHRoaW5ncyBJIHdhbnQgeW91IHRvIGhvbGQgaW4geW91ciBtaW5kLCBiZWZvcmUgd2UgZ28gZnVydGhlci4gRmlyc3QuIFRoaXMgaXMgbWluZHNldCB0cmFpbmluZy4gTm90IHByb2R1Y3QgdHJhaW5pbmcuIE5vdGhpbmcgaW4gdGhpcyBzZXNzaW9uIGlzIGFib3V0IEhvbGlkYXkgZG90IGNvbSBjb3ZlcmFnZSwgcHJpY2luZywgb3IgYWN0aXZhdGlvbiBzdGVwcy4gSXQgaXMgYWJvdXQgcmV3aXJpbmcgaG93IGVhY2ggb2YgeW91LCBhcyBwcmVzYWxlcyBhZ2VudHMsIHRoaW5rcyBhYm91dCBldmVyeSBjaGF0LiBCZWZvcmUgeW91IGV2ZXIgcGljayBvbmUgdXAuIFNlY29uZC4gUGVyc3Vhc2lvbiBoYXMgYWx3YXlzIGJlZW4gdGhlIHNhbWUgc2tpbGwuIEZpcmVzaWRlIHN0b3JpZXMuIFBob25lIGNhbGxzLiBMaXZlIGNoYXQuIE5vdywgQS5JLiBhc3Npc3RlZCBjaGF0LiBUaGUgbWVkaXVtIGNoYW5nZXMuIFRoZSBwc3ljaG9sb2d5IG9mIGhvdyBhIGh1bWFuIGRlY2lkZXMgdG8gc2F5IHllcyDigJQgaGFzIG5vdCBtb3ZlZCBhbiBpbmNoLCBpbiBmb3VyIHRob3VzYW5kIHllYXJzLiBUaGlyZC4gT25lIHRlYW0gaXMgYSBjb21taXRtZW50LiBOb3QgYSBzbG9nYW4uIEJBVSBhZ2VudHMgaGFuZGxlIHRoZSBkYXkgdG8gZGF5IGZsb3cuIFByZXNhbGVzIGFnZW50cyDigJQgeW91IOKAlCBzaXQgYXQgdGhlIGNvbnZlcnNpb24gcG9pbnQuIFNoaWZ0IG1hbmFnZXJzIHByb3RlY3QgcXVhbGl0eSBpbiB0aGUgbW9tZW50LiBBbmQgbWFuYWdlcnMgc2hhcGUgdGhlIGxvbmcgdGVybSBzdHJhdGVneS4gRXZlcnkgbGF5ZXIgaGFuZGxlcyBhIHBpZWNlIG9mIHRoZSBzYW1lIHRyYXZlbGxlcidzIGV4cGVyaWVuY2UuIFRvZGF5IGlzIGFib3V0IGJ1aWxkaW5nIG9uZSBzaGFyZWQgd2F5LCBvZiB0aGlua2luZy4gQWNyb3NzIGFsbCBmb3VyIGxheWVycy4=",
    "U28uIExldCdzIHN0YXJ0IHdpdGggdGhlIG1vc3QgYmFzaWMgcXVlc3Rpb24gb2YgYWxsLiBXaGF0IGlzIHNhbGVzPyBUYWtlIGEgbW9tZW50LiBBbmQgcmVhbGx5IHNpdCB3aXRoIGl0LiBZb3Ugd2lsbCBub3RpY2UgdGhlIGRvbGxhciBzaWduIGhpZGRlbiBpbnNpZGUgdGhlIHdvcmQuIEFuZCB0aGF0J3MgdGhlIHRyYXAuIE1vc3QgcGVvcGxlIHNlZSBzYWxlcyBhcyB0cmFuc2FjdGlvbnMuIEFzIG1vbmV5IGNoYW5naW5nIGhhbmRzLiBCdXQgdGhlIGFuc3dlciBnb2VzIGZhci4gRmFyIGRlZXBlciwgdGhhbiB0aGF0LiBMZXQncyBvcGVuIGl0IHVwLiBIZXJlIGlzIHRoZSB0cnV0aC4gVGhlIG1vbWVudCBhIHRyYXZlbGxlciBvcGVucyBhIGNoYXQgd2l0aCB5b3UsIHNhbGVzIGhhcyBhbHJlYWR5IHN0YXJ0ZWQuIFRoZXkgaGF2ZSBhbHJlYWR5IHNlYXJjaGVkLiBDb21wYXJlZCB1cyBhZ2FpbnN0IEFpcmFsbywgb3IgSG9sYWZseS4gSGVzaXRhdGVkLiBFdmVyeSByZXBseSB5b3Ugc2VuZCwgbW92ZXMgdGhlbSBlaXRoZXIgdG93YXJkIGFjdGl2YXRpb24uIE9yIGZ1cnRoZXIgYXdheSBmcm9tIGl0LiBZb3UgYXJlIG5vdCBhIGhlbHAgZGVzay4gWW91IGFyZSBhIGd1aWRlLiBXaG8gaGFwcGVucyB0byB1c2UgY2hhdCwgYXMgeW91ciBtZWRpdW0uIEFuZCB0aGUgZG9sbGFyIHNpZ24gdHJhcCwgaXMgcmVhbC4gV2hlbiBhIHByZXNhbGVzIGFnZW50IHNlZXMgc2FsZXMgYXMgbW9uZXkgaW4sIHRoZXkgb3B0aW1pc2UgZm9yIHRoZSBwdXJjaGFzZS4gV2hlbiB0aGV5IHNlZSBpdCBhcyB2YWx1ZSBleGNoYW5nZSwgdGhleSBvcHRpbWlzZSBmb3IgdGhlIGN1c3RvbWVyJ3MgcGVhY2Ugb2YgbWluZC4gQW5kIHRoZSBwdXJjaGFzZXMgZm9sbG93LiBUaGUgYWdlbnRzIHdobyBjYXJyeSB0aGUgZG9sbGFyIHNpZ24gbWluZHNldCwgaGl0IHRoZWlyIGJhc2ljIG1ldHJpY3MuIFRoZSBhZ2VudHMgd2hvIGNhcnJ5IHRoZSB2YWx1ZSBleGNoYW5nZSBtaW5kc2V0LCBiZWNvbWUgdGhlIG9uZXMgY3VzdG9tZXJzIGNvbWUgYmFjayB0by4gRXZlcnkgdHJpcC4gTGlzdGVuIGNhcmVmdWxseSB0byB0aGlzLiBXaGVuIGEgdHJhdmVsbGVyIHR5cGVzLCB3aWxsIHRoaXMgd29yayBpbiBKYXBhbiDigJQgdGhleSBhcmUgbm90IGFza2luZyBhYm91dCBuZXR3b3JrIGNvdmVyYWdlLiBUaGV5IGFyZSBhc2tpbmcuIENhbiB5b3UgcHJvbWlzZSBtZSwgSSB3aWxsIG5vdCBsYW5kIGluIFRva3lvIGF0IG1pZG5pZ2h0LiBXaXRoIGEgZGVhZCBwaG9uZS4gQW5kIG5vIHdheSwgdG8gZmluZCBteSBob3RlbC4gVGhlIGxpdGVyYWwgcXVlc3Rpb24uIElzIHRoZSBzeW1wdG9tLiBUaGUgZW1vdGlvbmFsIG5lZWQuIElzIHRoZSBjYXVzZS4gTGVhcm4gdG8gbGlzdGVuLCBwYXN0IHRoZSB3b3Jkcy4=",
    "U2FsZXMuIElzIG5vdCBqdXN0IGEgdHJhbnNhY3Rpb24uIEl0IGlzIHRoZSBhcnQuIEFuZCB0aGUgc2NpZW5jZS4gT2YgaHVtYW4gcGVyc3Vhc2lvbi4gQW5kIHRoZSBleGNoYW5nZSBvZiB2YWx1ZS4gSXQgaXMgYWJvdXQgaWRlbnRpZnlpbmcgYSBuZWVkLiBSZWZyYW1pbmcgcGVyc3BlY3RpdmVzLiBBbmQgZW5hYmxpbmcgYSB0cmFuc2Zvcm1hdGlvbi4gRnJvbSBhIGN1cnJlbnQgc3RhdGUuIFRvIGEgZGVzaXJlZCBmdXR1cmUgc3RhdGUuIEF0IGl0cyBjb3JlLiBFdmVyeSBzYWxlcyBpbnRlcmFjdGlvbi4gSXMgYSBwc3ljaG9sb2dpY2FsIGJyaWRnZS4gQmV0d2VlbiBhIHByb2JsZW0sIGFuZCBhIHNvbHV0aW9uLiBCdWlsdCBvbiB0cnVzdC4gQW5kIHN0cmF0ZWdpYyBjb21tdW5pY2F0aW9uLiBUaGF0IGlzIHRoZSBkaXNjaXBsaW5lLiBXZSBhcmUgcmVhbGx5IHByYWN0aWNpbmcuIEV2ZXJ5IHNpbmdsZSBkYXkuIE5vdGljZS4gQXJ0IEFORCBzY2llbmNlLiBOb3Qgb25lLiBPciB0aGUgb3RoZXIuIFRoZSBhcnQgaXMgdGhlIGVtcGF0aHkuIFRoZSB0b25lLiBUaGUgdGltaW5nIG9mIGEgcGF1c2UsIGJlZm9yZSB5b3UgaGl0IHNlbmQuIFRoZSBzY2llbmNlIGlzIHRoZSByZXBlYXRhYmxlIGZyYW1ld29yay4gWW91ciBkaXNjb3ZlcnkgcXVlc3Rpb25zLiBZb3VyIHJlY29tbWVuZGF0aW9uIHN0cnVjdHVyZS4gQWdlbnRzIHdobyBsZWFuIG9ubHkgb24gYXJ0LCBhcmUgaW5jb25zaXN0ZW50LiBBZ2VudHMgd2hvIGxlYW4gb25seSBvbiBzY2llbmNlLCBmZWVsIHJvYm90aWMuIFdlIGFyZSB0cmFpbmluZyBwcmVzYWxlcywgZm9yIGJvdGguIE5vdy4gVGhpcyBuZXh0IGxpbmUsIGlzIHRoZSBvbmx5IHNlbnRlbmNlIGluIHRoaXMgZGVjayB0aGF0IHJlYWxseSBtYXR0ZXJzLiBGcm9tIGEgY3VycmVudCBzdGF0ZS4gVG8gYSBkZXNpcmVkIGZ1dHVyZSBzdGF0ZS4gSWYgYSBwcmVzYWxlcyBhZ2VudCBjYW5ub3QgYXJ0aWN1bGF0ZSB3aGVyZSBhIGN1c3RvbWVyIGlzIHJpZ2h0IG5vdyDigJQgYW54aW91cyBhYm91dCBiZWluZyBvZmZsaW5lIGFicm9hZCwgY29uZnVzZWQgYWJvdXQgYWN0aXZhdGlvbiwgZnJ1c3RyYXRlZCBieSBwYXN0IHJvYW1pbmcgYmlsbHMg4oCUIGFuZCB3aGVyZSB0aGV5IHdhbnQgdG8gYmUgZml2ZSBtaW51dGVzIGZyb20gbm93IOKAlCBjb25maWRlbnQsIGFjdGl2YXRlZCwgcmVhZHkgdG8gdHJhdmVsIOKAlCB0aGV5IGRvIG5vdCBoYXZlIGEgY29udmVyc2F0aW9uLiBUaGV5IGhhdmUgYSBxdWVzdGlvbiBhbmQgYW5zd2VyIGxvb3AuIFdhaXRpbmcgdG8gZGllLiBXcml0ZSB0aGF0IG9uIGEgc3RpY2t5IG5vdGUuIEFib3ZlIHlvdXIgbW9uaXRvci4gQW5kIGZpbmFsbHkuIFRydXN0LiBEYXZpZCBNYWlzdGVyJ3MgdHJ1c3QgZXF1YXRpb24uIFRydXN0IGVxdWFscyBjcmVkaWJpbGl0eSwgcGx1cyByZWxpYWJpbGl0eSwgcGx1cyBpbnRpbWFjeS4gRGl2aWRlZCBieSBzZWxmIG9yaWVudGF0aW9uLiBTZWxmIG9yaWVudGF0aW9uLCBpbiB0aGUgZGVub21pbmF0b3IuIFRoZSBtb3JlIGl0IGlzIGFib3V0IHlvdS4gT3Igb3VyIHBvbGljaWVzLiBPciBvdXIgc3lzdGVtLiBUaGUgbG93ZXIgdGhlIGN1c3RvbWVyJ3MgdHJ1c3QuIFRoZSBtb3JlIGl0IGlzIGFib3V0IHRoZW0uIFRoZSBoaWdoZXIgdGhlIHRydXN0LiBUaGUgYmVzdCBwcmVzYWxlcyBhZ2VudHMgaW4gdGhlIHdvcmxkLCB0eXBlIHJvdWdobHkgdGhpcnR5IHBlcmNlbnQgb2YgdGhlIHdvcmRzIGluIGEgY2hhdC4gVGhlIHN0cnVnZ2xpbmcgb25lcywgdHlwZSBzZXZlbnR5LiBGbGlwIHRob3NlIG51bWJlcnMuIEFuZCB5b3VyIGNvbnZlcnNpb24gcmF0ZSwgZmxpcHMgd2l0aCB0aGVtLg==",
    "QSBxdWljayBkaXNjbGFpbWVyLiBCZWZvcmUgd2UgZ28gZGVlcGVyLiBUaGUgYmlibGljYWwgcmVmZXJlbmNlcyBJIGFtIGFib3V0IHRvIHVzZSwgYXJlIG5vdCBpbnRlbmRlZCB0byBhdHRhY2sgb3IgZGVncmFkZSBhbnkgcmVsaWdpb3VzIGdyb3VwLCBjdWx0dXJlLCBvciBiZWxpZWYuIEZyb20gYW4gYWdub3N0aWMgdmlld3BvaW50LCB0aGVzZSByZWZlcmVuY2VzIHNlcnZlIGFzIGEgZmVhcmxlc3MgYW5jaG9yaW5nIG9mIGdsYXJpbmcgbmFycmF0aXZlIGZhY3RzLiBGb3VuZCB3aXRoaW4gYW4gYW5jaWVudCB3cml0dGVuIHRleHQuIFRoYXQgaGFzIGV4aXN0ZWQsIGZvciBtaWxsZW5uaWEuIFRoZSBnb2FsIGlzIHNpbXBsZS4gVG8gZXhwbG9yZSB0aGUgZGVlcC1yb290ZWQgcHN5Y2hvbG9naWNhbCBkeW5hbWljcywgb2YgdGhlIGh1bWFuIG1pbmQuIEFuZCB3aGF0IG1heSB2ZXJ5IHdlbGwgYmUsIHRoZSBmaXJzdCByZWNvcmRlZCBzYWxlcyB0cmFuc2FjdGlvbiwgaW4gaGlzdG9yeS4gSSBhbSBzYXlpbmcgdGhpcyBzbG93bHkuIE9uIHB1cnBvc2UuIFRoZSBuZXh0IGZvdXIgc2xpZGVzIHVzZSBFZGVuIGFzIGEgdmVoaWNsZS4gTm90IGFzIGEgZG9jdHJpbmUuIElmIGFueW9uZSBpcyB1bmNvbWZvcnRhYmxlIHdpdGggdGhhdCBmcmFtaW5nLCB5b3UgaGF2ZSB0aGUgcm9vbSB0byBvcHQgb3V0LiBXaXRob3V0IGp1ZGdlbWVudC4gQW5kIG5vdGljZSB3aGF0IEkganVzdCBkaWQuIFNpZ25wb3N0aW5nIGludGVudC4gTmFtaW5nIHBvc3NpYmxlIGRpc2NvbWZvcnQuIE9mZmVyaW5nIG9wdCBvdXQuIFRoYXQsIGlzIGl0c2VsZiBhIGNoYXQgc2tpbGwuIFlvdSB3aWxsIHVzZSB0aGUgc2FtZSBmcmFtaW5nIHRoZSBuZXh0IHRpbWUgYSBjdXN0b21lciB0eXBlcyDigJQgSSBhbSBub3QgdmVyeSB0ZWNoIHNhdnZ5LiBQbGVhc2UgYmUgcGF0aWVudCB3aXRoIG1lLiBXaHkgdGhpcyBzdG9yeS4gV2h5IG5vdCBzdG9yaWVzIGZyb20gdGhlIGNhbGwgY2VudHJlIGluZHVzdHJ5LiBPciBmYW1vdXMgY3VzdG9tZXIgc2VydmljZSBsZWdlbmRzLiBUaG9zZSBhcmUgZ3JlYXQuIEJ1dCB0aGV5IGFyZSB0YWN0aWNhbC4gRWRlbiwgaXMgdGhlIG9ubHkgZG9jdW1lbnRlZCBuYXJyYXRpdmUgd2UgaGF2ZSwgd2hlcmUgeW91IGNhbiBzZWUgdGhlIGVudGlyZSBwc3ljaG9sb2d5IG9mIHBlcnN1YXNpb24uIERpc3NlY3RlZC4gU3RlcC4gQnkuIFN0ZXAuIEluIGp1c3QgYSBmZXcgc2VudGVuY2VzLiBTbyBzZXQgdGhlIGZyYW1lIHdpdGggbWUsIG5vdy4gRnJvbSB0aGlzIHBvaW50IG9uLCB3ZSBhcmUgbm90IHJlYWRpbmcgc2NyaXB0dXJlLiBXZSBhcmUgcmVhZGluZyBhIGNoYXQgdHJhbnNjcmlwdC4gQW55dGhpbmcgSSBkZXNjcmliZSwgaXMgYSBiZWhhdmlvdXIgeW91IHdpbGwgc2VlIGluIGEgcmVhbCBIb2xpZGF5IGRvdCBjb20gY29udmVyc2F0aW9uLiBUaGlzIHNoaWZ0LiBUaGUgY29zdHVtZXMgY2hhbmdlLiBUaGUgY2hvcmVvZ3JhcGh5IGRvZXMgbm90Lg==",
    "V2hpbGUgaGlzdG9yaWFucyBsb29rIHRvIE1lc29wb3RhbWlhbiBtYXJrZXRzLiBUaGUgU2lsayBSb2FkLiBBbmQgc28gb24uIFRoZSB0cnVlIGJsYWNrIGFuZCB3aGl0ZSBvcmlnaW4gb2Ygc2FsZXMsIHRyYWNlcyBiYWNrLCB0byBhIGdhcmRlbi4gQW5kIGEgbWFzdGVyY2xhc3MgaW4gcGVyc3Vhc2lvbi4gVGhlIHNldHRpbmcuIFRoZSBHYXJkZW4gb2YgRWRlbi4gVGhlIHNhbGVzcGVyc29uLiBUaGUgU2VycGVudC4gVGhlIHByb3NwZWN0LiBFdmUuIEFuZCB0aGUgcHJvZHVjdC4gVGhlIEFwcGxlLiBXaGljaCByZXByZXNlbnRzIGtub3dsZWRnZS4gVGhlIGZpcnN0IGV2ZXIgY2xvc2VkLXdvbiBkZWFsLCBoYXBwZW5lZCBpbiB0aGUgR2FyZGVuIG9mIEVkZW4uIFdoZW4gdGhlIHNlcnBlbnQsIHBpdGNoZWQgdGhlIHdvcmxkLCB0byBFdmUuIEJ1dCBoZXJlIGlzIHdoYXQgbW9zdCBwZW9wbGUgbWlzcy4gVGhlIFNlcnBlbnQuIERpZCBkaXNjb3ZlcnkgZmlyc3QuIEhlIGRpZCBub3Qgb3BlbiB3aXRoLCBidXkgbXkgYXBwbGUuIEhlIG9wZW5lZCB3aXRoIGEgcXVlc3Rpb24uIERpZCBHb2QgcmVhbGx5IHNheT8gVGhhdC4gSXMgdGV4dGJvb2sgb3Blbi1lbmRlZCBkaXNjb3ZlcnkuIEhlIHN1cmZhY2VkIGFuIGFzc3VtcHRpb24uIEJlZm9yZSBoZSBldmVyIHByb3Bvc2VkIGEgc29sdXRpb24uIFRoZSBsZXNzb24gZm9yIHByZXNhbGVzLiBObyBkaXNjb3ZlcnkuIE5vIHJlY29tbWVuZGF0aW9uLiBFdmVyLiBUaGUgYWdlbnQgd2hvIHR5cGVzIOKAlCB3aGljaCBjb3VudHJ5IGFyZSB5b3UgdmlzaXRpbmcg4oCUIGdldHMgYSB0cmFuc2FjdGlvbi4gVGhlIGFnZW50IHdobyB0eXBlcyDigJQgdGVsbCBtZSBhIGxpdHRsZSBhYm91dCB0aGUgdHJpcCB5b3UgYXJlIHBsYW5uaW5nIOKAlCBnZXRzIGEgcmVsYXRpb25zaGlwLiBOZXh0LiBFdmUgd2FzIGFscmVhZHkgcXVhbGlmaWVkLCBiZWZvcmUgdGhlIHBpdGNoLiBTaGUgd2FzIGN1cmlvdXMuIFNoZSB3YXMgaW4gcHJveGltaXR5LiBTaGUgaGFkIHRoZSBhZ2VuY3kgdG8gYWN0LiBUaGUgU2VycGVudCBkaWQgbm90IGNyZWF0ZSBkZW1hbmQuIEhlIHVuY292ZXJlZCBpdC4gTW9zdCBvZiB0aGUgbG9zdCBlU0lNIHB1cmNoYXNlcyBvbiBvdXIgcGxhdGZvcm0gdG9kYXksIGFyZSBub3QgZnJvbSBjb2xkIHZpc2l0b3JzLiBUaGV5IGFyZSBmcm9tIHRyYXZlbGxlcnMgd2hvIGNhbWUgdG8gY2hhdCwgd2l0aCByZWFsIGludGVudC4gQW5kIGEgcHJlc2FsZXMgYWdlbnQsIGZhaWxlZCB0byB1bmNvdmVyIHRoYXQgaW50ZW50LCBpbiB0aW1lLiBBbmQgZmluYWxseS4gVGhlIHByb2R1Y3Qgd2FzIGtub3dsZWRnZS4gSXQgd2FzIG5vdCB0aGUgYXBwbGUuIFRoZSBhcHBsZSwgaXMgdGhlIGVTSU0uIFRoZSBTLksuVS4gVGhlIHRyYW5zZm9ybWF0aW9uLCBpcyB0aGUgdmFsdWUuIFNvIGFzayB5b3Vyc2VsZi4gRXZlcnkgc2luZ2xlIGNoYXQuIFdoYXQgaXMgdGhpcyBjdXN0b21lciwgYWN0dWFsbHkgYnV5aW5nPyBBIGRhdGEgcGxhbj8gT3IgdGhlIHBlYWNlIG9mIG1pbmQuIE9mIHN0ZXBwaW5nIG9mZiBhIHBsYW5lLiBBbmQgc2VlaW5nIHRoZWlyIHBob25lIGNvbm5lY3QuIEJlZm9yZSB0aGV5IHJlYWNoIHBhc3Nwb3J0IGNvbnRyb2wuIEV2ZXJ5IHByb2R1Y3QgeW91IHNlbGwsIGhhcyBhIHRlY2huaWNhbCBzaGVsbC4gQW5kIGFuIGVtb3Rpb25hbCBjb3JlLiBBbmQgdGhlIHB1cmNoYXNlLiBIYXBwZW5zIG9uIHRoZSBlbW90aW9uYWwgY29yZS4gUHJhY3RpY2UgdGhpcyBmcmFtaW5nLiBXaGVuIGEgY3VzdG9tZXIgYXNrcyB3aGF0IG1ha2VzIEhvbGlkYXkgZG90IGNvbSBkaWZmZXJlbnQgZnJvbSBBaXJhbG8gb3IgSG9sYWZseS4gRG8gbm90IHN0YXJ0IHdpdGggbWVnYWJ5dGVzLiBPciBjb3ZlcmFnZSBtYXBzLiBUZWxsIHRoZW0gd2hhdCBsaWZlIGxvb2tzIGxpa2UgYmVmb3JlLiBIb3VycyBjb21wYXJpbmcgdGFicy4gRmVhciBvZiByb2FtaW5nIGNoYXJnZXMuIEFuZCB3aGF0IGxpZmUgbG9va3MgbGlrZSBhZnRlci4gVGVuIG1pbnV0ZXMgaW4gYSBjaGF0IHdpdGggdXMuIFRoZSBlU0lNIGNvbm5lY3RpbmcgdGhlIG1vbWVudCB0aGV5IGxhbmQuIFRoYXQuIElzIHRoZSBhcHBsZS4=",
    "Tm93LiBMZXQncyBicmVhayBkb3duIHRoZSBhbmF0b215IG9mIHRoYXQgb3JpZ2luYWwgcGl0Y2guIFRoZSBTZXJwZW50IGRpZCBub3QganVzdCB0YWxrLiBIZSB1c2VkIHRoZSBjb3JlIHByaW5jaXBsZXMgdGhhdCBkcml2ZSBldmVyeSBtb2Rlcm4gc2FsZXMgZnVubmVsLCB0b2RheS4gT25lLiBIZSBpZGVudGlmaWVkIHRoZSBwYWluIHBvaW50LiBUaGUgZ2FwIGJldHdlZW4gd2hlcmUgRXZlIHdhcy4gQW5kIHdoZXJlIHNoZSBjb3VsZCBiZS4gVHdvLiBIZSBoYW5kbGVkIHRoZSBvYmplY3Rpb24uIFJlZnJhbWluZyByaXNrLiBBcyBvcHBvcnR1bml0eS4gVGhyZWUuIEhlIGRlbGl2ZXJlZCBhIHZhbHVlIHByb3Bvc2l0aW9uLiBGb2N1c2VkIG9uIHRoZSByZXR1cm4gb24gaW52ZXN0bWVudCwgb2YgdHJhbnNmb3JtYXRpb24uIE5vdCB0aGUgY29zdCBvZiB0aGUgdHJhbnNhY3Rpb24uIEFuZCBmb3VyLiBIZSBjcmVhdGVkIHVyZ2VuY3kuIFRyaWdnZXJpbmcgdGhlIGZpcnN0IHJlY29yZGVkIGluc3RhbmNlLCBvZiBGLk8uTS5PLiBEb2VzIHRoYXQgc291bmQgZmFtaWxpYXI/IE1hcCBlYWNoIG1vdmUgdG8gYSBjaGF0IHlvdSByYW4gdGhpcyB3ZWVrLiBQYWluIHBvaW50LiBUaGUgbW9tZW50IGEgdHJhdmVsbGVyIHRlbGxzIHlvdSB0aGV5IGFyZSBkcmVhZGluZyBhbm90aGVyIHJvYW1pbmcgYmlsbC4gT3IgdGhhdCB0aGVpciBsYXN0IHRyaXAgd2VudCBiYWRseSwgYmVjYXVzZSB0aGV5IGNvdWxkIG5vdCBnZXQgb25saW5lLiBPYmplY3Rpb24gcmVmcmFtZS4gV2hlbiB0aGV5IHNheSwgZml2ZSBkb2xsYXJzIGlzIHRvbyBtdWNoIGZvciBhIGZldyBkYXlzIG9mIGRhdGEuIEFuZCB5b3UgaGVscCB0aGVtIHNlZSB3aGF0IHRoZXkgYXJlIGFjdHVhbGx5IHBheWluZyBmb3IuIFIuTy5JLiBvZiB0cmFuc2Zvcm1hdGlvbi4gV2hlbiB5b3UgZnJhbWUgdGhlIGVTSU0sIGFnYWluc3QgdGhlIGNvc3Qgb2Ygb25lIHR3ZW50eSBkb2xsYXIgcm9hbWluZyBkYXkuIE9yIG9uZSB0YXhpLWRyaXZlciBzY2FtLCBiZWNhdXNlIHRoZXkgY291bGQgbm90IGxvYWQgYSBtYXAuIEFuZCBGLk8uTS5PLiBXaGVuIHlvdSBtZW50aW9uLCB0aGF0IGFjdGl2YXRpb24gbmVlZHMgdG8gaGFwcGVuIGJlZm9yZSB0aGV5IGJvYXJkIHRoZWlyIGZsaWdodC4gTm90IGFmdGVyLiBOb3cuIFRoZSBvYmplY3Rpb24gcmVmcmFtZS4gSXMgdGhlIGhpZ2hlc3QgbGV2ZXJhZ2Ugc2tpbGwgaW4gdGhpcyBlbnRpcmUgZGVjay4gRm9yIHByZXNhbGVzLiBZb3Ugd2lsbCBzdXJlbHkgbm90IGRpZS4gVGhhdC4gSXMgYSBvbmUgc2VudGVuY2UgcmVmcmFtZS4gVGhhdCBmbGlwcGVkIGZlYXIgaW50byB1cHNpZGUuIFRoZSBuZXh0IHRpbWUgYSBjdXN0b21lciB0eXBlcyDigJQgSSB0aGluayBJIHdpbGwganVzdCByZWx5IG9uIGhvdGVsIHdpZmkg4oCUIHlvdXIgam9iIGlzIG5vdCB0byByZXRyZWF0LiBZb3VyIGpvYiBpcyB0byBnZW50bHkgcmVmcmFtZSwgd2hhdCByZWx5aW5nIG9uIGhvdGVsIHdpZmkgYWN0dWFsbHkgbWVhbnMuIEl0IG1lYW5zIGxvc2luZyBjb250YWN0IHdpdGggdGhlIHBlb3BsZSB5b3UgbG92ZSwgd2hpbGUgeW91IGFyZSBpbiB0cmFuc2l0LiBJdCBtZWFucyBubyBtYXBzIGluIHRoZSB0YXhpLiBJdCBtZWFucyBhIHN0cmFuZ2VyIGluIGEgZm9yZWlnbiBjb3VudHJ5LCBrbm93aW5nIGV4YWN0bHkgd2hlcmUgeW91IGFyZS4gQmVjYXVzZSB5b3UgaGFkIHRvIGFzayB0aGVtLCBmb3IgZGlyZWN0aW9ucy4gUmVmcmFtaW5nLiBJcyBub3QgbWFuaXB1bGF0aW9uLiBJdCBpcyBoZWxwaW5nIHRoZSBjdXN0b21lciBzZWUsIHdoYXQgdGhleSBhbHJlYWR5IHN1c3BlY3RlZC4gQW5kIG9uZSBsYXN0IHRoaW5nLiBGLk8uTS5PLiBpcyBub3QgYSB0YWN0aWMuIEl0IGlzIGEgcHN5Y2hvbG9naWNhbCBjb25zdGFudC4gTG9zcyBhdmVyc2lvbi4gSXMgcm91Z2hseSB0d2ljZSBhcyBwb3dlcmZ1bCwgYXMgdGhlIGVxdWl2YWxlbnQgZ2Fpbi4gVGhhdCBpcyBLYWhuZW1hbidzIE5vYmVsIHByaXplIHJlc2VhcmNoLiBVc2VkIGV0aGljYWxseSDigJQgbmV2ZXIgb24gZmFrZSBjb3VudGRvd24gdGltZXJzLCBidXQgb24gcmVhbCBhY3RpdmF0aW9uIGxlYWQgdGltZXMsIHJlYWwgZmxpZ2h0IHRpbWVzLCByZWFsIHJpc2sgb2YgbGFuZGluZyB3aXRob3V0IHNlcnZpY2Ug4oCUIEYuTy5NLk8uIGlzIHRoZSBtb3N0IHBvd2VyZnVsIGNvbnZlcnNpb24gdG9vbCB3ZSBoYXZlLiBVc2VkIGRpc2hvbmVzdGx5IOKAlCBpdCBkZXN0cm95cyBvdXIgcmVwdXRhdGlvbi4gU2hpZnQgbWFuYWdlcnMuIFRoaXMgaXMgYSBjb3JlIGNvYWNoaW5nIHBvaW50LiBGbGFnIGFueSBjaGF0IHRoYXQgdXNlcyBmYWJyaWNhdGVkIHNjYXJjaXR5LiBJbW1lZGlhdGVseS4=",
    "UXVpY2sgYWN0aXZpdHkuIFRvIGxvY2sgdGhhdCBpbi4gT24geW91ciBzY3JlZW4sIHlvdSB3aWxsIHNlZSBmb3VyIGNoYXQgc25pcHBldHMuIEZyb20gcmVhbCBIb2xpZGF5IGRvdCBjb20gY29udmVyc2F0aW9ucy4gQW5kIGZvdXIgbW92ZXMuIEZyb20gdGhlIGxlc3NvbiB3ZSBqdXN0IGNvdmVyZWQuIFRhcCBhIGNoYXQgc25pcHBldC4gVGhlbiB0YXAgdGhlIG1vdmUgaXQgZGVtb25zdHJhdGVzLiBXcm9uZyBtYXRjaGVzIGdlbnRseSBzaGFrZS4gSnVzdCB0cnkgYSBkaWZmZXJlbnQgcGFpcmluZy4gVGhlcmUgaXMgbm8gdGltZSBwcmVzc3VyZS4gSWYgeW91IG5lZWQgbW9yZSB0aW1lIHRvIHRoaW5rIOKAlCBwYXVzZSB0aGUgbmFycmF0aW9uIG9uIHRoZSByaWdodCBzaWRlLiBUaGVuIHJlc3VtZSwgd2hlbmV2ZXIgeW91IGFyZSByZWFkeS4gVGFrZSBhIG1vbWVudC4gUmVhZCBlYWNoIHNuaXBwZXQgY2FyZWZ1bGx5LiBOb3RpY2UgdGhlIGxhbmd1YWdlLiBUaGUgcGFpbiBwb2ludCBzb3VuZHMgZGlmZmVyZW50IGZyb20gdGhlIG9iamVjdGlvbiByZWZyYW1lLiBUaGUgUi5PLkkuIGxpbmUgc291bmRzIGRpZmZlcmVudCBmcm9tIHRoZSB1cmdlbmN5IGxpbmUuIFRoZSBzaGFwZSBvZiBlYWNoIG1vdmUsIGhhcyBhIGZpbmdlcnByaW50LiBBbmQgYXMgeW91IG1hdGNoIHRoZW0g4oCUIGFzayB5b3Vyc2VsZi4gV2hlbiB3YXMgdGhlIGxhc3QgdGltZSBJIHNlbnQgc29tZXRoaW5nIGxpa2UgdGhpcy4gSW4gYSByZWFsIGNoYXQuIFRoYXQgaXMgdGhlIGVudGlyZSBwb2ludCBvZiB0aGlzIGV4ZXJjaXNlLiBOb3QgdG8gZ2V0IGZvdXIgb3V0IG9mIGZvdXIuIEJ1dCB0byByZWNvZ25pc2UgdGhlc2UgbW92ZXMuIFRoZSBuZXh0IHRpbWUgeW91IGFyZSB0eXBpbmcuIE1hdGNoIGFsbCBmb3VyLiBXaGVuIHlvdSBhcmUgcmVhZHksIHdlIHdpbGwgbW92ZSBvbi4=",
    "VG8gdW5kZXJzdGFuZCBzYWxlcyB0b2RheS4gSXMgdG8gdW5kZXJzdGFuZCB0aGUgQXBwbGUuIEFuZCB0aGUgU2VycGVudC4gQXMgbWV0YXBob3JzLiBGb3IgdGhlIGJ1eWVyLXNlbGxlciBkeW5hbWljLiBPbmUuIFRoZSBBcHBsZS4gSXMgdGhlIHNvbHV0aW9uLiBFdmVyeSBwcm9kdWN0IHlvdSBzZWxsLCBpcyBhbiBBcHBsZS4gSXQgcmVwcmVzZW50cyB0aGUgcHJvbWlzZSBvZiBhIG5ldyBiZXR0ZXIuIEEgYnJpZGdlLCB0byBhIGRlc2lyZWQgc3RhdGUgb2YgYmVpbmcuIFR3by4gVGhlIFNlcnBlbnQuIElzIHRoZSBjb25zdWx0YW50LiBUaGUgY2F0YWx5c3QuIFRoZSBvbmUgd2hvIG1vdmVzIGEgcHJvc3BlY3QsIGZyb20gc3RhdHVzIHF1bywgdG8gYWN0aW9uLiBUaHJvdWdoIG5hcnJhdGl2ZS4gQW5kIHRocmVlLiBUaGUgcmVzdWx0LiBJcyB0aGUgZXhjaGFuZ2UuIEV2ZSB0cmFkZWQgc2VjdXJpdHksIGZvciBhbiB1cGdyYWRlLiBBbmQgdGhpcyByZXZlYWxzIHRoZSBtb3N0IGltcG9ydGFudCB0cnV0aCBpbiBzYWxlcy4gVmFsdWUsIGlzIHN1YmplY3RpdmUuIFRoZXJlZm9yZS4gVmFsdWUsIGlzIHBlcmNlaXZlZC4gQ2F0YWx5c3QuIE5vdCBwdXNoZXIuIEEgcHVzaGVyIHRyaWVzIHRvIGRyYWcgYSBjdXN0b21lciBpbnRvIGEgcHVyY2hhc2UuIEEgY2F0YWx5c3QgbG93ZXJzIHRoZSBhY3RpdmF0aW9uIGVuZXJneS4gVW50aWwgdGhlIGN1c3RvbWVyIHB1cmNoYXNlcywgb24gdGhlaXIgb3duLiBUaGUgZmlyc3QgZmVlbHMgbGlrZSBhIGhhcmQgc2VsbC4gVGhlIHNlY29uZCBmZWVscyBsaWtlIGEgZnJpZW5kLCB3aG8gaGFzIHRyYXZlbGxlZCBiZWZvcmUuIEdpdmluZyB5b3UgYWR2aWNlLiBOb3cuIEhlcmUgaXMgYSBoYXJkIHRydXRoLiBTdGF0dXMgcXVvLiBJcyB5b3VyIHJlYWwgY29tcGV0aXRvci4gTW9zdCBhYmFuZG9uZWQgY2hhdHMsIGFyZSBub3QgbG9zdCB0byBBaXJhbG8gb3IgSG9sYWZseS4gVGhleSBhcmUgbG9zdCB0byBpbmVydGlhLiBUaGUgY3VzdG9tZXIgY2xvc2VzIHRoZSB0YWIuIEFuZCBkZWNpZGVzIHRvIGp1c3QgZGVhbCB3aXRoIGl0LCB3aGVuIHRoZXkgbGFuZC4gRXZlJ3MgY29tcGV0aXRvciB3YXMgbm90IGFub3RoZXIgc2FsZXNwZXJzb24uIEl0IHdhcyB0aGUgY29tZm9ydCBvZiBkb2luZyBub3RoaW5nLiBTdXJmYWNlIHRoZSBjb3N0IG9mIGluYWN0aW9uLiBJbiBldmVyeSBjaGF0LiBOb3QgaW4gYSBwdXNoeSB3YXkuIEluIGEgY2FyaW5nIHdheS4gV2hhdCBkb2VzIHRoZSBjdXN0b21lciBhY3R1YWxseSBsb3NlLCBieSBub3QgYWN0aXZhdGluZyB0b2RheS4gQW5kIHRoZSBpbXBsaWNhdGlvbiBvZiB2YWx1ZSBiZWluZyBwZXJjZWl2ZWQuIExpc3RlbiBjYXJlZnVsbHkuIElkZW50aWNhbCBwcmljZXMsIHByb2R1Y2Ugb3Bwb3NpdGUgcmVhY3Rpb25zLCBmcm9tIHR3byBkaWZmZXJlbnQgY3VzdG9tZXJzLiBBIGZpdmUgZG9sbGFyIGVTSU0sIGlzIG5vdGhpbmcgdG8gYSBkaWdpdGFsIG5vbWFkIHdob3NlIGluY29tZSBkZXBlbmRzIG9uIHN0YXlpbmcgY29ubmVjdGVkLiBBbmQgb3V0cmFnZW91cywgdG8gYSBjYXN1YWwgdG91cmlzdCB3aG8gdGhpbmtzIGRhdGEgc2hvdWxkIGJlIGZyZWUuIFlvdXIgam9iIGluIGNoYXQsIGlzIG5vdCB0byBkZWZlbmQgdGhlIHByaWNlLiBZb3VyIGpvYiwgaXMgdG8gZXhwYW5kIHRoZSBwZXJjZXB0aW9uLCBvZiB3aGF0IHRoZSBjdXN0b21lciBpcyBhY3R1YWxseSBidXlpbmcuIEJlZm9yZSB0aGUgcHJpY2UgZXZlciBiZWNvbWVzIHRoZSBpc3N1ZS4gVXNlIHZhbHVlIGFuY2hvcmluZy4gQmVmb3JlIHlvdSBldmVyIHF1b3RlIHRoZSBlU0lNLCBhbmNob3IgYWdhaW5zdCB0aGUgY29zdCBvZiB0aGUgcHJvYmxlbS4gQSB0eXBpY2FsIHJvYW1pbmcgZGF5IHdpdGggbW9zdCBjYXJyaWVycyBjb3N0cyBiZXR3ZWVuIGZpZnRlZW4gYW5kIHR3ZW50eSBkb2xsYXJzLiBQYXVzZS4gVGhlbiBxdW90ZSBvdXIgcGxhbiBhdCBmaXZlLiBOb3cgdGhlaXIgYnJhaW4gaXMgY29tcGFyaW5nIGZpdmUsIHRvIHR3ZW50eS4gTm90IGZpdmUsIHRvIGZyZWUuIEthaG5lbWFuIHdvbiB0aGUgTm9iZWwgUHJpemUsIGZvciBzaG93aW5nIGV4YWN0bHkgaG93IHRoaXMgd29ya3Mu",
    "U28uIEhlcmUgaXMgdGhlIGNsb3NpbmcgdGhvdWdodC4gRXZlJ3MgZW5jb3VudGVyIHdpdGggdGhlIHNlcnBlbnQgYW5kIHRoZSBmcnVpdCwgaW4gdGhlIEdhcmRlbiBvZiBFZGVuLCB0ZWFjaGVzIHVzIHRoYXQgc2FsZXMgaXMgbm90IG1lcmVseSBhbiBlY29ub21pYyBhY3Rpdml0eS4gSXQgaXMgYSBkZWVwbHkgcm9vdGVkLiBIdW1hbi4gUHN5Y2hvbG9naWNhbCBlbmNvdW50ZXIuIEl0IGlzIHRoZSBwcm9jZXNzIG9mIHBhaW50aW5nIGEgdmlzaW9uIHNvIGNvbXBlbGxpbmcuIFRoYXQgdGhlIHByb3NwZWN0IGlzIHdpbGxpbmcgdG8gY3Jvc3MgYSB0aHJlc2hvbGQsIHRoZXkgcHJldmlvdXNseSBmZWFyZWQuIFRoZSB0b29scyBoYXZlIGNoYW5nZWQsIHNpbmNlIHRoZSBiZWdpbm5pbmcgb2YgdGltZS4gQnV0IHRoZSBlc3NlbnRpYWwgcHN5Y2hvbG9neSBvZiBjbG9zaW5nIGEgc2FsZS4gUmVtYWlucy4gRXRlcm5hbC4gQW5kIHJlbWVtYmVyLiBGZWFyIGlzIGFsd2F5cyBwcmVzZW50LCBpbiB0aGUgbW9tZW50IG9mIHB1cmNoYXNlLiBFdmVuIG9uIGEgZml2ZSBkb2xsYXIgZVNJTS4gSGl0dGluZyBDb25maXJtLiBJcyB0aGUgY3VzdG9tZXIgbWFraW5nIGEgY29tbWl0bWVudC4gVG8gYSB0cmlwIHRoYXQgaGFzIG5vdCBoYXBwZW5lZCB5ZXQuIFRvIGEgdGVjaG5vbG9neSB0aGV5IG1heSBoYXZlIG5ldmVyIHVzZWQgYmVmb3JlLiBDaGFuZ2UuIEV2ZW4gYSBzbWFsbCBvbmUuIElzIGxvc3Mgb2YgdGhlIGtub3duLiBBY2tub3dsZWRnZSB0aGUgaGVzaXRhdGlvbiwgYmVmb3JlIHlvdSBhc2sgZm9yIHRoZSBwdXJjaGFzZS4gQW5kIHlvdSB3aWxsIHNlZSBjb21wbGV0aW9uIHJhdGVzLCBjbGltYi4gTW9zdCBhZ2VudHMgdHJ5IHRvIGRyb3duIGZlYXIgaW4gdGVjaG5pY2FsIHNwZWNzLiBUaGUgYmVzdCBwcmVzYWxlcyBhZ2VudHMsIG5hbWUgdGhlIGZlZWxpbmcuIEFuZCB3YWxrIHRocm91Z2ggaXQsIHdpdGggdGhlIGN1c3RvbWVyLiBZb3VyIGpvYiBhdCB0aGUgY2xvc2UgaXMgbm90IHRvIHB1c2ggaGFyZGVyLiBZb3VyIGpvYiBpcyB0byBsb3dlciB0aGUgc3Rha2VzIG9mIHllcy4gUmVhc3N1cmUgdGhlbSBvbiBhY3RpdmF0aW9uLiBNZW50aW9uIHRoZSByZWZ1bmQgd2luZG93LiBUZWxsIHRoZW0gYWJvdXQgdGhlIGN1c3RvbWVyIHdobyBsYW5kZWQgaW4gTGlzYm9uIGxhc3Qgd2Vlay4gQW5kIG1lc3NhZ2VkIHVzIGFmdGVyd2FyZHMuIEp1c3QgdG8gc2F5LCB0aGVpciBlU0lNIGtpY2tlZCBpbiwgYmVmb3JlIHRoZXkgZ290IG9mZiB0aGUgamV0IGJyaWRnZS4gU3RhbmZvcmQncyByZXNlYXJjaCBvbiBjb25zdW1lciBkZWNpc2lvbiBwc3ljaG9sb2d5IHNob3dzLiBUaGUgaHVtYW4gYnJhaW4gdHJlYXRzIGEgbWFqb3IgcHVyY2hhc2UgZGVjaXNpb24sIHRoZSBzYW1lIHdheSBpdCB0cmVhdHMgcGh5c2ljYWwgcGFpbi4gVGhhdCBpcyB3aHkgY2FydCBhYmFuZG9ubWVudCBpcyBzbyBjb21tb24uIFRoZSBicmFpbiBpcyBsaXRlcmFsbHksIHRyeWluZyB0byBhdm9pZCBwYWluLiBTbyB2aXNpb24gcGFpbnQgaW5zdGVhZC4gVGhyZWUgdGltZSBob3Jpem9ucy4gQXJyaXZhbCDigJQgc3RlcHBpbmcgb2ZmIHRoZSBwbGFuZSwgcGhvbmUgYWxyZWFkeSBjb25uZWN0aW5nLiBNaWQgdHJpcCDigJQgZGF5IHR3bywgdGV4dGluZyBmYW1pbHkgZnJvbSBhIGJlYWNoLCBub3QgdGhpbmtpbmcgYWJvdXQgY29ubmVjdGl2aXR5IGF0IGFsbC4gQWZ0ZXJ3YXJkcyDigJQgdGhlIHN0b3J5IHRoZXkgdGVsbCB3aGVuIHRoZXkgZ2V0IGhvbWUuIEFib3V0IHRoZSB0cmlwLCB0aGF0IGp1c3Qgd29ya2VkLiBBbmQgdG8gYnJpbmcgaXQgaG9tZS4gQS5JLiBpcyBhIHRvb2wuIE5vdCBhIHN1YnN0aXR1dGUuIEZvciB0aGlzIHBzeWNob2xvZ3kuIEEuSS4gYW1wbGlmaWVzIHdoYXQgeW91IGJyaW5nIHRvIGEgY2hhdC4gSWYgeW91IGJyaW5nIHRyYW5zYWN0aW9uYWwgdGhpbmtpbmcuIEEuSS4gc2NhbGVzIHRyYW5zYWN0aW9uYWwgdGhpbmtpbmcuIElmIHlvdSBicmluZyBlbXBhdGh5IGFuZCByZWZyYW1pbmcuIEEuSS4gc2NhbGVzIHRoYXQuIE1pbmRzZXQuIElzIHRoZSBsZXZlcmFnZSBwb2ludC4gQWx3YXlzLg==",
    "VGhlIGZpcnN0IGNsb3NlLiBSZWRlZmluZWQgb3VyIGhpc3RvcnkuIEJ1dCB5b3VyIG5leHQgY2xvc2UuIERlZmluZXMgeW91ciBmdXR1cmUuIE1heSB0b2RheSdzIGludHJvZHVjdGlvbi4gQW5kIG1pbmQgc2Vzc2lvbi4gRnVlbCBvdXIgdmlzaW9ucy4gT2YgYSBmdXR1cmUgd29ydGggY3Jvc3NpbmcgdGhlIHRocmVzaG9sZCBmb3IuIEJlZm9yZSB5b3UgbGVhdmUgdGhpcyByb29tLiBJIHdhbnQgeW91IHRvIGRvLCBvbmUgdGhpbmcuIFBoeXNpY2FsbHkuIE5vdCBpbiB5b3VyIGhlYWQuIFdyaXRlIGRvd24uIE9uZSBwcmluY2lwbGUgZnJvbSB0b2RheS4gVGhhdCB5b3Ugd2lsbCB1c2UsIG9uIHRoZSB2ZXJ5IG5leHQgY2hhdCB5b3UgdGFrZS4gVGhlIGNvZ25pdGl2ZSBjb3N0IG9mIHdyaXRpbmcgaXQgZG93biwgZHJhbWF0aWNhbGx5IGluY3JlYXNlcyB0aGUgY2hhbmNlLCBpdCBhY3R1YWxseSBoYXBwZW5zLiBDb25zaWRlciB0aGlzLiBUaGUgY2xvc2UuIE9mIG15IHNhbGUuIFRvIHlvdS4gRnJhbWUgdGhpcy4gQXMgRGF5IE9uZS4gTm90IGEgb25lIG9mZi4gRXZlcnl0aGluZyB0aGF0IGZvbGxvd3Mg4oCUIGNoYXQgdG9uZSBjbGluaWNzLiBSZWNvbW1lbmRhdGlvbiBmcmFtaW5nLiBPYmplY3Rpb24gY2xpbmljcy4gRXNjYWxhdGlvbiBoYW5kbGluZyB3aXRoIHlvdXIgc2hpZnQgbWFuYWdlcnMg4oCUIGFsbCBvZiBpdCBzaXRzIG9uIHRvcCBvZiB0b2RheSdzIGZvdW5kYXRpb24uIElmIHRvZGF5J3MgbGVzc29uIGRvZXMgbm90IGxhbmQuIFRoZSByZXN0IGlzIHVuc3RhYmxlIHNjYWZmb2xkaW5nLiBUb2RheSwgeW91IGJvdWdodCB0aGUgcGhpbG9zb3BoeS4gVGhlIHRlY2huaXF1ZSBtb2R1bGVzLiBBcmUgY29taW5nLiBUaGFuayB5b3UuIFRlYW0uIE5vdy4gR28gY2hhbmdlIGEgdHJhdmVsbGVyJ3MgZXhwZXJpZW5jZS4gV29ydGggY3Jvc3NpbmcgdGhlIHRocmVzaG9sZCBmb3Iu",
    "T25lIGxhc3QgdGhpbmcsIGJlZm9yZSB5b3UgZ28uIEkgd2FudCB5b3UgdG8gcHV0IHlvdXIgcGxlZGdlIGluIHdyaXRpbmcuIFJpZ2h0IG5vdy4gT24gdGhlIHNjcmVlbi4gVGhyZWUgc2hvcnQgY29tbWl0bWVudHMuIE9uZSBvcGVuIHF1ZXN0aW9uIHlvdSB3aWxsIGFzayBvbiB5b3VyIG5leHQgY2hhdC4gT25lIGFiYW5kb25lZCBjaGF0IHlvdSB3aWxsIHJld3JpdGUsIHVzaW5nIHRvZGF5J3MgZnJhbWV3b3JrLiBBbmQgdGhlIG5hbWUgb2Ygb25lIHByZXNhbGVzIHBlZXIsIHlvdSB3aWxsIHRyYWRlIHRyYW5zY3JpcHRzIHdpdGgsIHRoaXMgd2Vlay4gVHlwZSBlYWNoIG9uZSBpbi4gV2hlbiB5b3UgYXJlIGhhcHB5LCBjbGljayDigJQgU2F2ZSBteSBwbGVkZ2UuIFlvdSBjYW4gYWxzbyBwcmludCBpdC4gQW5kIHN0aWNrIGl0IG5leHQgdG8geW91ciBtb25pdG9yLiBUaGFuayB5b3UsIHRlYW0uIFRoZSB0aHJlc2hvbGQsIGlzIHlvdXJzIHRvIGNyb3NzLg=="
  ];
  function _dec(b) {
    const bin = atob(b);
    const u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(u8);
  }
  // Lazy decoded cache — never assigned to a global, never inserted into DOM.
  const SCRIPTS = new Proxy({}, {
    get(_, k) {
      const i = +k;
      if (Number.isNaN(i)) {
        if (k === 'length') return _S.length;
        return undefined;
      }
      return _dec(_S[i] || '');
    }
  });

  const synth = window.speechSynthesis;
  if (!synth) {
    console.warn('SpeechSynthesis not supported');
  }

  // State — locked to American English voice @ 0.90x, captions off, auto-advance on
  const LOCKED_RATE = 0.90;
  const state = {
    voice: null,
    rate: LOCKED_RATE,
    pitch: 1.0,
    autoAdvance: true,
    playing: false,
    currentUtter: null,
    currentIdx: 0,
    completed: false,
    captionsOn: true,
    voiceLabel: 'American English',
  };

  function pickLockedVoice(voices) {
    // Prefer Google's US English (Chrome's stock en-US voice — feminine-leaning).
    let v = voices.find(v => v.name === 'Google US English');
    if (v) return v;
    // Microsoft / Edge premium natural-sounding US female voices.
    v = voices.find(v => /^en[-_]US/i.test(v.lang) && /(aria|jenny|ava|nova|sara|emma)/i.test(v.name));
    if (v) return v;
    // Apple / macOS US English female voices (Samantha is the default Siri).
    v = voices.find(v => /^en[-_]US/i.test(v.lang) && /(samantha|allison|susan|victoria|karen|kathy|veena|female)/i.test(v.name));
    if (v) return v;
    // Any explicitly-female en-US voice.
    v = voices.find(v => /^en[-_]US/i.test(v.lang) && /female/i.test(v.name));
    if (v) return v;
    // Any Google en-US voice.
    v = voices.find(v => /^en[-_]US/i.test(v.lang) && /google/i.test(v.name));
    if (v) return v;
    // Any en-US voice.
    v = voices.find(v => /^en[-_]US/i.test(v.lang));
    if (v) return v;
    // Last resort: any English voice.
    return voices.find(v => /^en[-_]/i.test(v.lang)) || voices[0] || null;
  }

  function loadVoices() {
    return new Promise(resolve => {
      let voices = synth.getVoices();
      if (voices && voices.length) return resolve(voices);
      synth.addEventListener('voiceschanged', () => {
        resolve(synth.getVoices());
      }, { once: true });
      // Fallback
      setTimeout(() => resolve(synth.getVoices() || []), 1200);
    });
  }

  // Speak helpers
  function stop() {
    state.playing = false;
    if (synth) synth.cancel();
    state.currentUtter = null;
    renderControls();
    setCaption('');
  }

  function speak(idx, opts = {}) {
    if (!synth) return;
    synth.cancel();
    const text = SCRIPTS[idx] || '';
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    if (state.voice) u.voice = state.voice;
    u.rate = state.rate;
    u.pitch = state.pitch;
    u.lang = (state.voice && state.voice.lang) || 'en-US';

    state.currentUtter = u;
    state.currentIdx = idx;
    state.playing = true;
    state.completed = false;
    setCaption(text);
    updateReplayMode();

    // Highlight sentences as they're spoken
    const sentences = splitSentences(text);
    let lastSentenceIdx = -1;
    u.onboundary = (ev) => {
      // ev.charIndex is the char index in u.text
      const ci = ev.charIndex || 0;
      let acc = 0;
      for (let i = 0; i < sentences.length; i++) {
        acc += sentences[i].length;
        if (ci < acc) {
          if (i !== lastSentenceIdx) {
            lastSentenceIdx = i;
            highlightSentence(i);
          }
          break;
        }
      }
    };
    u.onend = () => {
      if (state.currentUtter !== u) return; // superseded
      state.playing = false;
      state.currentUtter = null;
      state.completed = true;
      renderControls();
      updateReplayMode();
      // Auto-advance disabled. User clicks the morphed Refresh→Next button
      // (or, on activity slides, the activity's own Proceed button) to move on.
    };
    u.onerror = () => {
      state.playing = false;
      state.currentUtter = null;
      renderControls();
    };
    synth.speak(u);
    renderControls();
  }

  function splitSentences(text) {
    // Keep terminators with the sentence; split on sentence-end punctuation
    const parts = text.match(/[^.!?]+[.!?]+\s*|[^.!?]+$/g) || [text];
    return parts;
  }

  // UI ------------------------------------------------------------
  let uiRoot = null;
  let captionEl = null;

  function buildUI(voices) {
    state.voice = pickLockedVoice(voices);
    const resolvedName = state.voice ? state.voice.name : '(no voice available)';
    const resolvedLang = state.voice ? state.voice.lang : '';
    const exactMatch = state.voice && state.voice.name === 'Google US English';

    const root = document.createElement('div');
    root.id = 'narration-bar';
    root.innerHTML = `
      <button class="nb-btn nb-home" data-act="home" title="Go back to the beginning" aria-label="Go back to beginning of deck">
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 6h2v12H6zM19 6 9 12l10 6z" fill="currentColor"/></svg>
      </button>
      <button class="nb-btn nb-back" data-act="back" title="Previous slide" aria-label="Previous slide">
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>
      </button>
      <button class="nb-btn nb-play" data-act="play" title="Play / Pause narration" aria-label="Play or pause narration">
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
      </button>
      <button class="nb-btn nb-replay" data-act="replay" title="Restart this slide" aria-label="Restart current slide narration">
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" fill="currentColor"/></svg>
      </button>
    `;
    document.body.appendChild(root);
    uiRoot = root;
    captionEl = null;
    // Suppress fallback-voice indicator since chrome is hidden; quietly log it.
    if (!exactMatch) {
      console.info('[narration] Google US English not installed; using fallback:', resolvedName, resolvedLang);
    }

    root.querySelector('.nb-play').addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      togglePlay();
    });
    root.querySelector('.nb-replay').addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const btn = e.currentTarget;
      if (btn.classList.contains('is-next')) {
        // Refresh button has morphed into a "next slide" button.
        goNext();
      } else {
        // Restart narration for the current slide from the beginning.
        speak(getActiveIdx());
      }
    });
    root.querySelector('.nb-back').addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      goBack();
    });
    root.querySelector('.nb-home').addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      goHome();
    });
    // Update Back button enabled/disabled state.
    updateBackBtnState();
  }

  function getActiveIdx() {
    const deck = document.querySelector('deck-stage');
    if (!deck) return 0;
    return typeof deck.index === 'number' ? deck.index : 0;
  }

  function renderControls() {
    if (!uiRoot) return;
    const btn = uiRoot.querySelector('.nb-play');
    if (state.playing) {
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor"/></svg>';
      btn.classList.add('is-playing');
      btn.title = 'Pause narration';
    } else {
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
      btn.classList.remove('is-playing');
      btn.title = 'Play narration';
    }
  }

  function togglePlay() {
    if (state.playing) {
      stop();
    } else {
      speak(getActiveIdx());
    }
  }

  // Navigate to the previous slide (Back button). Resumes narration there if
  // we were playing; otherwise just navigates silently.
  function goBack() {
    const deck = document.querySelector('deck-stage');
    if (!deck) return;
    const idx = getActiveIdx();
    if (idx <= 0) return;
    const target = idx - 1;
    const wasPlaying = state.playing;
    if (synth) synth.cancel();
    state.playing = false;
    state.currentUtter = null;
    if (typeof deck.goTo === 'function') {
      deck.goTo(target);
    } else if (typeof deck.prev === 'function') {
      deck.prev();
    }
    // The slidechange handler will update Back button & captions.
    // Auto-resume narration on the new slide if we were already playing.
    if (wasPlaying) {
      setTimeout(() => speak(target), 120);
    } else {
      renderControls();
      updateBackBtnState();
    }
  }

  function updateBackBtnState() {
    if (!uiRoot) return;
    const atStart = getActiveIdx() <= 0;
    const back = uiRoot.querySelector('.nb-back');
    if (back) {
      back.disabled = atStart;
      back.classList.toggle('is-disabled', atStart);
    }
    const home = uiRoot.querySelector('.nb-home');
    if (home) {
      home.disabled = atStart;
      home.classList.toggle('is-disabled', atStart);
    }
  }

  // Morph the Refresh button into a Next-slide button when narration on the
  // current slide is complete (and we're not already on the last slide).
  function updateReplayMode() {
    if (!uiRoot) return;
    const btn = uiRoot.querySelector('.nb-replay');
    if (!btn) return;
    const deck = document.querySelector('deck-stage');
    const slides = deck ? Array.from(deck.children).filter(el => el.tagName === 'SECTION') : [];
    const idx = getActiveIdx();
    const isLast = idx >= slides.length - 1;
    if (state.completed && !isLast) {
      btn.classList.add('is-next');
      btn.title = 'Proceed to next slide';
      btn.setAttribute('aria-label', 'Proceed to next slide');
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M8.59 7.41 10 6l6 6-6 6-1.41-1.41L13.17 12z" fill="currentColor"/></svg>';
    } else {
      btn.classList.remove('is-next');
      btn.title = 'Restart this slide';
      btn.setAttribute('aria-label', 'Restart current slide narration');
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" fill="currentColor"/></svg>';
    }
  }

  // Advance to the next slide & start its narration.
  function goNext() {
    const deck = document.querySelector('deck-stage');
    if (!deck) return;
    const slides = Array.from(deck.children).filter(el => el.tagName === 'SECTION');
    const idx = getActiveIdx();
    if (idx + 1 >= slides.length) return;
    if (synth) synth.cancel();
    state.playing = false;
    state.currentUtter = null;
    if (typeof deck.goTo === 'function') deck.goTo(idx + 1);
    setTimeout(() => speak(idx + 1), 200);
  }

  // Jump back to the very first slide (Home button).
  function goHome() {
    const deck = document.querySelector('deck-stage');
    if (!deck) return;
    const idx = getActiveIdx();
    if (idx <= 0) return;
    const wasPlaying = state.playing;
    if (synth) synth.cancel();
    state.playing = false;
    state.currentUtter = null;
    if (typeof deck.goTo === 'function') {
      deck.goTo(0);
    }
    if (wasPlaying) {
      setTimeout(() => speak(0), 120);
    } else {
      renderControls();
      updateBackBtnState();
    }
  }

  function setCaption(text) {
    if (!captionEl) return;
    if (!text) {
      captionEl.innerHTML = '';
      return;
    }
    const sentences = splitSentences(text);
    captionEl.innerHTML = sentences.map((s, i) =>
      `<span class="nb-sent" data-i="${i}">${s.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</span>`
    ).join('');
  }

  function highlightSentence(i) {
    if (!captionEl) return;
    captionEl.querySelectorAll('.nb-sent').forEach(el => el.classList.remove('is-active'));
    const el = captionEl.querySelector(`.nb-sent[data-i="${i}"]`);
    if (el) {
      el.classList.add('is-active');
    }
  }

  // Wire to deck
  function wireDeck() {
    const deck = document.querySelector('deck-stage');
    if (!deck) return;

    // Hide the deck-stage chrome (prev / next / reset / count overlay).
    // The narration bar in the bottom-right is the only on-screen control we want.
    function hideDeckChrome() {
      if (!deck.shadowRoot) return false;
      if (deck.shadowRoot.getElementById('__nb_hide_chrome')) return true;
      const s = document.createElement('style');
      s.id = '__nb_hide_chrome';
      s.textContent = `
        [data-omelette-chrome],
        .overlay,
        .rail,
        .rail-resize,
        .ctxmenu,
        .confirm-backdrop,
        .chrome,
        .controls,
        .nav,
        .toolbar { display: none !important; }
      `;
      deck.shadowRoot.appendChild(s);
      return true;
    }
    if (!hideDeckChrome()) {
      // shadowRoot may not be ready yet; retry on the next frames
      let tries = 0;
      const t = setInterval(() => {
        if (hideDeckChrome() || ++tries > 30) clearInterval(t);
      }, 100);
    }
    const updateSlideNum = (idx) => {
      const el = document.getElementById('nb-slidenum');
      if (el) el.textContent = `Slide ${idx + 1} of ${SCRIPTS.length}`;
    };
    deck.addEventListener('slidechange', (e) => {
      const i = e.detail.index;
      updateSlideNum(i);
      updateBackBtnState();
      state.completed = false;
      updateReplayMode();
      // If we were narrating, switch to new slide's narration
      if (state.playing) {
        speak(i);
      } else {
        // Pre-show caption for the new slide so the speaker can read along
        setCaption(SCRIPTS[i] || '');
      }
    });

    // === Lock navigation: no skipping ahead or back ===
    // Block keyboard nav (left/right/space/pgup/pgdn/home/end/digits) in capture phase.
    const navKeys = new Set([
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar', 'Enter'
    ]);
    window.addEventListener('keydown', (e) => {
      if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
      // Allow P for play/pause (handled separately) and Esc.
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') return;
      // Block digits 1-9 (deck-stage uses these to jump slides).
      if (/^[0-9]$/.test(e.key) || navKeys.has(e.key)) {
        e.stopPropagation();
        e.preventDefault();
      }
    }, true);
    // Initial caption
    setCaption(SCRIPTS[0] || '');
    updateSlideNum(0);
  }

  // Keyboard shortcut: P to toggle narration
  document.addEventListener('keydown', (e) => {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      togglePlay();
    }
  });

  // Boot
  (async () => {
    const voices = await loadVoices();
    buildUI(voices);
    // wait one tick for deck-stage to upgrade
    requestAnimationFrame(() => requestAnimationFrame(wireDeck));
    renderControls();
  })();

  // Bridge for activities.js / external scripts to drive narration
  window.__narration = {
    play: () => speak(getActiveIdx()),
    stop: () => stop(),
    toggle: () => togglePlay(),
    isPlaying: () => state.playing,
  };

  // Stop synth on page hide so it doesn't keep babbling
  window.addEventListener('pagehide', stop);
  window.addEventListener('beforeunload', stop);
})();
