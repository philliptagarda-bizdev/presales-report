/* Sales Training — Narration & Auto-advance Engine
 * Uses the browser SpeechSynthesis API for live audio narration.
 * Controls live in a fixed bar outside the slide canvas so the slide
 * layout is preserved exactly as authored.
 */

(function () {
  // Narration scripts — base64 encoded so they don't appear in plain text in source.
  // Decoded at runtime and fed straight to SpeechSynthesis; never injected into the DOM.
  const _S = [
    "QWZ0ZXIgYW4gZXllIG9wZW5lci4gUmVhZHkgZm9yIGEga2lsbGVyIGxldmVsIHVwLiBJbiB0aGUgZmlyc3Qgc2Vzc2lvbi4gV2UgY3JhY2tlZCBvcGVuLiBXaHkgaHVtYW4gYmVpbmdzIGJ1eS4gVG9kYXkuIFdlIGNyYWNrIG9wZW4uIEhvdyBlbGl0ZSBwcmVzYWxlcyBhZ2VudHMuIENsb3NlLiBXZSB3aWxsIGRpc2NvdmVyIHlvdXIgdW5pcXVlIHN0cmVuZ3Rocy4gT3IgeW91ciBkZWFkbHkgdHJhaXRzLiBBbmQgYnkgdGhlIGVuZCBvZiB0aGlzIHNlc3Npb24uIFlvdSB3aWxsIGxlYXZlLiBXaXRoIGEgc2FsZXMgYXNzYXNzaW4gYWxpYXMuIEEgc3R5bGUuIEEgY29kZS4gU3BlY2lmaWMgdG8geW91LiBUaHJlZSB0aGluZ3MgdG8gaG9sZCBpbiB5b3VyIG1pbmQuIEJlZm9yZSB3ZSBiZWdpbi4gRmlyc3QuIFRha2UgdGhlIGFzc2Vzc21lbnQgc2VyaW91c2x5LiBUaGUgZml2ZSBtaW51dGVzIHlvdSBwdXQgaW4uIFdpbGwgZ2l2ZSB5b3UgYSBtaXJyb3IsIHlvdSBtYXkgbm90IGhhdmUgbG9va2VkIGludG8uIEluIGEgeWVhci4gRG8gbm90IGNsb3NlIHRoZSByZXN1bHRzIHBhZ2UuIERvIG5vdCBtaW5pbWlzZSBpdC4gRG8gbm90IHRlbGwgYW55b25lIHdobyB5b3UgYXJlLiBVbnRpbCB0aGUgc2Vzc2lvbiBlbmRzLiBTZWNvbmQuIFRoZSBhbGlhc2VzIGFyZSBub3QgYSBqb2tlLiBUaGV5IGFyZSBhIHdvcmtpbmcgbGFuZ3VhZ2UuIEEgd2F5IGZvciB5b3UuIFlvdXIgc2hpZnQgbWFuYWdlci4gQW5kIHlvdXIgcGVlcnMuIFRvIHRhbGsgYWJvdXQgeW91ciBjcmFmdC4gV2l0aG91dCBpdCBmZWVsaW5nIGxpa2UgYSBwZXJmb3JtYW5jZSByZXZpZXcuIEFuZCB0aGlyZC4gQnJpbmcgYW4gaG9uZXN0IG1pcnJvci4gVG9kYXkgaXMgZm9yIHRoZSBwZW9wbGUuIFdobyB3YW50IHRvIGdldCBzaGFycGVyLg==",
    "U28uIFdoYXQgbWFrZXMuIEEgc3VjY2Vzc2Z1bCBzYWxlc3BlcnNvbj8gTGV0J3MgZHJvcCB0aGUgbGF6eSBhbnN3ZXJzLiBJdCBpcyBub3QgbHVjay4gSXQgaXMgbm90IGJlaW5nIGluIHRoZSByaWdodCBwbGFjZS4gQXQgdGhlIHJpZ2h0IHRpbWUuIEx1Y2suIElzIHdoYXQgcGVvcGxlIHNheS4gV2hlbiB0aGV5IHJlZnVzZS4gVG8gc3R1ZHkgdGhlIHBhdHRlcm4uIFRvZGF5IHdlIHRhcmdldCB0aGUgc2V2ZW4uIFBsdXMgb25lLiBDb3JlIHNraWxscy4gQW5kIHRyYWl0cy4gVGhhdCBzZXBhcmF0ZSB0aGUgYXZlcmFnZSBjaGF0IGFnZW50LiBGcm9tIHRoZSBhc3Nhc3Npbi4gRWlnaHQgaW5ncmVkaWVudHMuIEVhY2ggd2l0aCBhIGZyYW1ld29yay4gU28geW91IGNhbiB0cmFpbiB0aGVtLiBOb3QganVzdCBob3BlLiBGb3IgdGhlbS4gVGhyZWUgcXVpY2sgcmVmcmFtZXMuIEJlZm9yZSB3ZSBnbyBpbi4gT25lLiBUb3AgcGVyZm9ybWVycyBhY3Jvc3MgZXZlcnkgaW5kdXN0cnksIHNoYXJlIG1vcmUgaW4gY29tbW9uIHdpdGggZWFjaCBvdGhlciwgdGhhbiB0aGV5IGRvIHdpdGggdGhlIGF2ZXJhZ2UgcGVyZm9ybWVyIGluIHRoZWlyIG93biBmaWVsZC4gVGhhdCBpcyBNY0tpbnNleSByZXNlYXJjaC4gTm90IG9waW5pb24uIFRoZSB0cmFpdHMgYXJlIHVuaXZlcnNhbC4gVHdvLiBUaGUgc2V2ZW4gdHJhaXRzLCBhcmUgbm90IHBlcnNvbmFsaXR5LiBUaGV5IGFyZSBza2lsbHMuIFBlcnNvbmFsaXR5IGlzIHdobyB5b3UgYXJlLiBTa2lsbHMgYXJlIHdoYXQgeW91IHRyYWluLiBUb2RheSBpcyB0cmFpbmluZy4gTm90IHRoZXJhcHkuIEFuZCB0aHJlZS4gU2hpZnQgbWFuYWdlcnMsIHdyaXRlIHRoaXMgZG93bi4gVGhlIHNldmVuIHRyYWl0cyBhcmUgYWxzbyB5b3VyIGNvYWNoaW5nIG1hcC4gRXZlcnkgdHJhbnNjcmlwdCByZXZpZXcuIEV2ZXJ5IG9uZSB0byBvbmUuIFNob3VsZCBtYXAgYmFjayB0byBvbmUgb2YgdGhlc2Ugc2V2ZW4u",
    "VHJhaXQgbnVtYmVyIG9uZS4gRXhjZWxsZW50IGNvbW11bmljYXRpb24uIFRoZSBvYmplY3RpdmVzLiBTb3VuZCBzaW1wbGUuIEhhcmQgaW4gcHJhY3RpY2UuIENsZWFybHkgZXhwbGFpbiB0aGUgcHJvZHVjdC4gTGlzdGVuIGFjdGl2ZWx5LiBUbyB1bmNvdmVyIHRydWUgbmVlZHMuIEFuZCBjb25jZXJucy4gQW5kIGJ1aWxkIHJhcGlkIHJhcHBvcnQuIFdlIHVzZSB0aGUgZnJhbWV3b3JrLiBDIGRvdCBMIGRvdCBFIGRvdCBBIGRvdCBSLiBDLiBDb25uZWN0LiBHcmVldC4gQnVpbGQgcmFwcG9ydC4gRXN0YWJsaXNoIHRydXN0LiBMLiBMaXN0ZW4uIEFjdGl2ZSBsaXN0ZW5pbmcuIEUuIEV4cGxhaW4uIERpcmVjdGx5LiBFYXN5IHRvIHVuZGVyc3RhbmQuIEEuIEFzay4gRWZmZWN0aXZlIGRpc2NvdmVyeSBxdWVzdGlvbnMuIFIuIFJlc29sdmUuIFN0cm9uZyBjYWxsIHRvIGFjdGlvbi4gVGhyZWUgc2hhcnBlciBwb2ludHMgb24gdGhpcy4gRmlyc3QuIENvbW11bmljYXRpb24uIElzIG5vdCB3aGF0IHlvdSB0eXBlLiBJdCBpcyB3aGF0IHRoZXkgcmVjZWl2ZS4gUmUtcmVhZCB5b3VyIG1lc3NhZ2UgYmVmb3JlIHlvdSBoaXQgc2VuZC4gSWYgdGhlIGN1c3RvbWVyIGlzIGFueGlvdXMuIFlvdXIgZmFjdHMgd2lsbCBub3QgY2FsbSB0aGVtLiBZb3VyIHRvbmUgd2lsbC4gU2Vjb25kLiBGb3JyZXN0ZXIgcmVzZWFyY2ggc2hvd3MgdGhhdCBjdXN0b21lcnMgd2lsbCBmb3JnaXZlIGEgc2xvdyByZXNwb25zZS4gVGhleSB3aWxsIG5vdCBmb3JnaXZlIGEgY29uZnVzaW5nIG9uZS4gQ2xhcml0eSBiZWF0cyBzcGVlZC4gQWx3YXlzLiBUaGlyZC4gVG9wIHByZXNhbGVzIGFnZW50cyB0eXBlIHJvdWdobHkgdGhpcnR5IHBlcmNlbnQgb2YgdGhlIHdvcmRzLiBJbiBhIGNoYXQuIFRoZSBzdHJ1Z2dsaW5nIG9uZXMsIHR5cGUgc2V2ZW50eS4gRmxpcCB0aG9zZSBudW1iZXJzLiBBbmQgeW91ciBjb252ZXJzaW9uIHJhdGUsIGZsaXBzIHdpdGggdGhlbS4=",
    "VHJhaXQgbnVtYmVyIHR3by4gUGVyc2lzdGVuY2UuIEFuZCByZXNpbGllbmNlLiBIZXJlIGlzIHRoZSBoYXJkIHRydXRoLiBTYWxlcyBpcyB0b3VnaC4gUmVqZWN0aW9uIGlzIGd1YXJhbnRlZWQuIEN1c3RvbWVycyB3aWxsIGNsb3NlIHlvdXIgY2hhdC4gTWlkIHNlbnRlbmNlLiBNaWQgcmVjb21tZW5kYXRpb24uIE1pZCBzaGlmdC4gWW91ciBqb2IuIElzIG5vdCB0byB0YWtlIGl0IHBlcnNvbmFsbHkuIFlvdXIgam9iLiBJcyB0byBoYW5kbGUgdGhlIG5vLiBXaXRoIHJlc2lsaWVuY2UuIEFuZCB0byB0cmVhdCBldmVyeSByZWplY3Rpb24uIEFzIGEgZGF0YSBwb2ludC4gQXMgZmVlZGJhY2suIEFzIGZ1ZWwuIFdlIG5lZWQgdG8gUyBkb3QgSCBkb3QgQSBkb3QgVCBkb3QgVCBkb3QgRSBkb3QgUi4gVG8gZW5kdXJlLiBJbiBteSBvd24gZXhwZXJpZW5jZS4gQWNyb3NzIGEgZGVjYWRlIGluIHRoaXMgaW5kdXN0cnkuIEkgY2FtZSB1cCB3aXRoIGEgc3lzdGVtYXRpYyB3YXkuIFRvIHNoYXR0ZXIuIEFuZCBwcm9jZXNzLiBSZWplY3Rpb24uIFRocmVlIHRoaW5ncyB0byByZW1lbWJlci4gT25lLiBUaGUgbW9zdCBzdWNjZXNzZnVsIHByZXNhbGVzIHBlb3BsZSBvbiB0aGUgcGxhbmV0LiBIYXZlIGhpZ2hlciByZWplY3Rpb24gY291bnRzLiBUaGFuIHRoZSBzdHJ1Z2dsZXJzLiBUaGV5IGdldCB0b2xkIG5vLiBNb3JlLiBCZWNhdXNlIHRoZXkgYXNrLiBNb3JlLiBUaGUgcmVwcyB3aG8gYXZvaWQgbm8uIEFsc28gYXZvaWQgeWVzLiBUd28uIFJlc2lsaWVuY2UgaXMgbm90IHRvdWdobmVzcy4gSXQgaXMgcmVjb3ZlcnkgdGltZS4gVGhlIGZhc3RlciB5b3UgYm91bmNlIGJhY2sgZnJvbSBhIG5vLiBUaGUgbW9yZSBjaGF0cyB5b3UgY2FuIHRha2UuIFdpdGggeW91ciBmdWxsIGVuZXJneSBpbnRhY3QuIFRocmVlLiBTaGlmdCBtYW5hZ2Vycy4gV2hlbiB5b3Ugc2VlIGEgcHJlc2FsZXMgYWdlbnQgYWJzb3JiaW5nIGEgcm91Z2ggY2hhdC4gU3RlcCBpbi4gQSB0d28gbWludXRlIGRlY29tcHJlc3Npb24uIFNhdmVzIGFuIGVudGlyZSBzaGlmdC4gTGV0IHVzIGRpc3NlY3QgdGhlIFMgSCBBIFQgVCBFIFIgZnJhbWV3b3JrLiBPbiB0aGUgbmV4dCBzbGlkZS4=",
    "VGhlIFMgZG90IEggZG90IEEgZG90IFQgZG90IFQgZG90IEUgZG90IFIuIEZyYW1ld29yay4gU2V2ZW4gbW92ZXMuIFRvIHR1cm4gYSBuby4gSW50byBhIHN0ZXAgZm9yd2FyZC4gUy4gU3RyYXRlZ2ljIG1pbmRzZXQuIFZpZXcgcmVqZWN0aW9uIGFzIGEgZGF0YSBwb2ludC4gSW4gYSB2b2x1bWUgZ2FtZS4gTm90IHBlcnNvbmFsLiBILiBIYXJkZW5lZCByZXNpbGllbmNlLiBEZXZlbG9wIHRoZSBjYWxsdXMuIFRvIGhhbmRsZSBuby4gV2l0aG91dCBsb3NpbmcgbW9tZW50dW0uIEEuIEFuYWx5emUgdGhlIGludGVyYWN0aW9uLiBQaW5wb2ludCB0aGUgc291cmNlIG9mIGZyaWN0aW9uLiBUaW1pbmcuIEJ1ZGdldC4gT3IgdHJ1c3QuIFQuIFRhcmdldCB0aGUgbGVzc29uLiBJc29sYXRlIG9uZSBrZXkgdGFrZWF3YXkuIEZvciB0aGUgbmV4dCBsZWFkLiBULiBUcmFuc2Zvcm0gdGhlIG5vLiBQaXZvdCB0aGUgZm9sbG93IHVwIHN0cmF0ZWd5LiBCYXNlZCBvbiBmZWVkYmFjay4gRS4gRWxldmF0ZSB0aGUgYXBwcm9hY2guIFNoYXJwZW4geW91ciBwaXRjaC4gVXNpbmcgdGhlIGxlYXJuZWQgaW5zaWdodC4gUi4gUmVwZWF0LiBBbmQgcmVmaW5lLiBSZS1lbmdhZ2UuIFdpdGggYSBtb3JlIHBvbGlzaGVkIGFwcHJvYWNoLiBUaHJlZSBkZWVwZXIgcG9pbnRzLiBGaXJzdC4gVGhlIGFuYWx5emUgc3RlcC4gSXMgd2hlcmUgbW9zdCByZXBzIGZhaWwuIFRoZXkgZmVlbCB0aGUgbm8uIFdpdGhvdXQgZGlzc2VjdGluZyBpdC4gU2l4dHkgc2Vjb25kcyBvZiBjb2xkIHJldmlldy4gUmlnaHQgYWZ0ZXIgdGhlIGNoYXQuIElzIHRoZSBkaWZmZXJlbmNlLiBCZXR3ZWVuIGxlYXJuaW5nLiBBbmQganVzdCBzdWZmZXJpbmcuIFNlY29uZC4gVHJhY2tpbmcuIElzIHRoZSBtb3N0IHVuZGVycmF0ZWQgcGFydC4gSWYgeW91IGRvIG5vdCBsb2cgeW91ciBubydzLiBZb3Ugd2lsbCByZXBlYXQgdGhlIHNhbWUgc2hhcGUgb2YgcmVqZWN0aW9uLiBGb3IgbW9udGhzLiBXaXRob3V0IHNlZWluZyBpdC4gVGhpcmQuIFRoZSByZXBlYXQgYW5kIHJlZmluZSBsb29wLiBJcyB3aGF0IGNvbXBvdW5kcyBpbnRvIG1hc3RlcnkuIFRoZSB0b3AgcGVyZm9ybWVycyBpbiBvdXIgaW5kdXN0cnkuIFJ1biB0aGlzIGxvb3Agb24gdGhlbXNlbHZlcy4gV2Vla2x5LiBNZW1vcml6ZSB0aGlzIGFjcm9ueW0uIFRoZSBuZXh0IHRpbWUgYSBjdXN0b21lciBnaG9zdHMgeW91IG1pZCBjaGF0LiBSdW4gaXQu",
    "VHJhaXQgbnVtYmVyIHRocmVlLiBFbXBhdGh5LiBPYmplY3RpdmUuIFdlIGRvIG5vdCBzZWxsIHByb2R1Y3RzLiBXZSBzb2x2ZSBwcm9ibGVtcy4gV2UgcHV0IG91cnNlbHZlcyBpbiB0aGUgY3VzdG9tZXIncyBzaG9lcy4gQW5kIHdlIHRhaWxvciBzb2x1dGlvbnMuIFRvIHNwZWNpZmljIHBhaW4gcG9pbnRzLiBQbGF5IHRoZSBTIGRvdCBMIGRvdCBPIGRvdCBULiBHYW1lLiBTLiBTb2x2ZS4gTm90IHNlbGwuIFByb2R1Y3QgaXMgYSB0b29sLiBTb2x1dGlvbiBpcyB0aGUgZ29hbC4gTC4gTG9vayB0aHJvdWdoIHRoZWlyIGxlbnMuIFVzZSBlbXBhdGh5LiBUbyB1bmRlcnN0YW5kIHRoZWlyIG9ic3RhY2xlcy4gTy4gT3JpZW50IHRvIHBhaW4uIE1hcCB0aGVpciBzdHJ1Z2dsZXMuIEJlZm9yZSBwcm9wb3NpbmcgYSBzb2x1dGlvbi4gVC4gVGFpbG9yIHRoZSBoaXQuIEN1c3RvbWl6ZSB0aGUgc29sdXRpb24uIEZvciB0aGVpciB1bmlxdWUgc2l0dWF0aW9uLiBUaHJlZSBzaGFycGVuaW5nIGN1dHMgb24gZW1wYXRoeS4gRmlyc3QuIEVtcGF0aHkgaXMgYSBjaGF0IHNraWxsLiBOb3QgYSB2aWJlLiBTcGVjaWZpY2FsbHksIGl0IGlzIG5hbWluZy4gVGhlIGN1c3RvbWVyJ3MgZmVlbGluZy4gQmVmb3JlIHlvdSBldmVyIGFkZHJlc3MuIFRoZSBjdXN0b21lcidzIHF1ZXN0aW9uLiBUaGF0IGlzIHRoZSBtb3ZlLiBTZWNvbmQuIEJhaW4gc3R1ZGllZCB0ZW5zIG9mIHRob3VzYW5kcyBvZiBjb25zdW1lciBzZXJ2aWNlIGludGVyYWN0aW9ucy4gVGhlIG51bWJlciBvbmUgZHJpdmVyIG9mIHRydXN0LiBXYXMgdGhlIGN1c3RvbWVyIGZlZWxpbmcsIHRoYXQgdGhlIGFnZW50IHVuZGVyc3Rvb2QuIFdoYXQgdGhleSBhY3R1YWxseSBuZWVkZWQuIE5vdCB3aGF0IHRoZXkgYXNrZWQgZm9yLiBUaGlyZC4gV2hlbiBhIGN1c3RvbWVyIHNheXMsIHdpbGwgdGhpcyB3b3JrIGluIEphcGFuLiBUaGV5IGFyZSBub3QgYXNraW5nIGFib3V0IGNvdmVyYWdlLiBUaGV5IGFyZSBhc2tpbmcuIENhbiB5b3UgcHJvbWlzZSBtZS4gSSB3aWxsIG5vdCBsYW5kIGluIFRva3lvIGF0IG1pZG5pZ2h0LiBXaXRoIGEgZGVhZCBwaG9uZS4gUmVhZCBwYXN0IHRoZSB3b3Jkcy4gRXZlcnkgY2hhdC4=",
    "VHJhaXQgbnVtYmVyIGZvdXIuIERlZXAgcHJvZHVjdCBrbm93bGVkZ2UuIEtub3cgdGhlIGZlYXR1cmVzLiBCZW5lZml0cy4gQW5kIGxpbWl0YXRpb25zLiBJbnNpZGUgb3V0LiBBbnN3ZXIgcXVlc3Rpb25zLiBXaXRoIHRvdGFsIGNvbmZpZGVuY2UuIEFuZCBhbnRpY2lwYXRlIGNvbmNlcm5zLiBCZWZvcmUgdGhlIGN1c3RvbWVyIHZvaWNlcyB0aGVtLiBXZSBuZWVkIHRvIEEgZG90IEMgZG90IEUuIEl0LiBBLiBBbnRpY2lwYXRlIGZyaWN0aW9uLiBQcmVkaWN0IG9iamVjdGlvbnMuIFNlZWluZyB0aGUgc2hhdHRlciBjb21pbmcuIExldHMgeW91IGNvbnRyb2wgdGhlIGltcGFjdC4gQy4gQ29tbWFuZCBkZXRhaWxzLiBNYXN0ZXIgZmVhdHVyZXMuIEJlbmVmaXRzLiBBbmQgbGltaXRhdGlvbnMuIFRvdGFsIGtub3dsZWRnZS4gRGVmZWF0cyBjdXN0b21lciBkb3VidC4gRS4gRXhlY3V0ZSB3aXRoIGNvbmZpZGVuY2UuIEFuc3dlciBxdWVzdGlvbnMgd2l0aCBwcmVjaXNpb24uIEF1dGhvcml0eSBzdG9wcyBjdXN0b21lcnMuIEZyb20gbG9va2luZyBmb3IgdGhlIGV4aXQuIFRocmVlIGFkZGl0aW9uYWwgcG9pbnRzLiBGaXJzdC4gUHJvZHVjdCBrbm93bGVkZ2UuIElzIG5vdCBqdXN0IGZvciB0aGUgZGVtby4gSXQgaXMgeW91ciB3ZWFwb24uIEluIGV2ZXJ5IG9iamVjdGlvbi4gVGhlIGN1c3RvbWVyIHdobyBhc2tzLCB3aGF0J3MgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB5b3VyIGRhdGEgcGxhbiBhbmQgQWlyYWxvLiBJcyBzaWduYWxsaW5nLiBUaGV5IGFyZSB3aXRoaW4gc2Vjb25kcy4gT2YgbGVhdmluZy4gWW91ciBrbm93bGVkZ2UgaG9sZHMgdGhlbS4gU2Vjb25kLiBBbnRpY2lwYXRpbmcgY29uY2VybnMuIE1lYW5zIHN0dWR5aW5nIHBhc3QgY2hhdCB0cmFuc2NyaXB0cy4gUGF0dGVybnMgcmVwZWF0LiBUaGUgc2FtZSBmaXZlIHdvcnJpZXMgc3VyZmFjZSwgaW4gcm91Z2hseSBuaW5lIG91dCBvZiB0ZW4gY29udmVyc2F0aW9ucy4gS25vdyB0aGVtLiBDb2xkLiBUaGlyZC4gQ29uZmlkZW5jZSBpcyBhIG1lYXN1cmFibGUgc2lnbmFsLiBDdXN0b21lcnMgY2FuIGZlZWwgaGVzaXRhdGlvbi4gSW4geW91ciBtZXNzYWdlIHRpbWluZy4gSW4geW91ciBoZWRnZSB3b3Jkcy4gUmVwbGFjZSwgSSB0aGluayB0aGlzIHNob3VsZCB3b3JrLiBXaXRoLCB0aGlzIGlzIHRoZSByaWdodCBwbGFuIGZvciB5b3VyIHRyaXAuIFRoZSBjaGFuZ2UgaW4gbGFuZ3VhZ2UuIENoYW5nZXMgdGhlIGNoYW5nZSBpbiBjb252ZXJzaW9uLg==",
    "VHJhaXQgbnVtYmVyIGZpdmUuIEFkYXB0YWJpbGl0eS4gVGhlIHNhbGVzIGxhbmRzY2FwZSBpcyBjb25zdGFudGx5IGV2b2x2aW5nLiBBZGp1c3QgeW91ciBhcHByb2FjaC4gQmFzZWQgb24gdGhlIGNsaWVudC4gQW5kIHRoZSBzaXR1YXRpb24uIExlYXJuIHF1aWNrbHkuIEFuZCBwaXZvdCBpbiByZWFsIHRpbWUuIFJlc3VsdHMgViBkb3QgQSBkb3QgUiBkb3QgWS4gVi4gVmlnaWxhbnQgb2JzZXJ2YXRpb24uIENvbnN0YW50bHkgc2NhbiB0aGUgbWFya2V0IGFuZCBjbGllbnQgbmVlZHMuIERvIG5vdCBmb2N1cyBvbiB0aGUgcGFzdC4gQS4gQWRhcHRpdmUgbWFuZXV2ZXJpbmcuIEFkanVzdCB5b3VyIHBpdGNoIGluIHJlYWwgdGltZS4gVW50aWwgeW91IGZpbmQgdGhlIGZyYWN0dXJlIHBvaW50LiBSLiBSYXBpZCBwcm9jZXNzaW5nLiBMZWFybiBpbnN0YW50bHkgZnJvbSBhIG5vIG9yIGhlc2l0YXRpb24uIFBpdm90IGltbWVkaWF0ZWx5LiBZLiBZaWVsZCB0byB0aGUgZmFjdHMuIEFjY2VwdCB0aGUgZXZvbHZlZCBsYW5kc2NhcGUuIEFiYW5kb24gdGhlIG9sZCBzY3JpcHQuIEFuZCBtb3ZlIHdpdGggdGhlIG5ldyByZWFsaXR5LiBUaHJlZSBtb3JlIHNoYXJwZW5pbmcgcG9pbnRzLiBGaXJzdC4gQWRhcHRhYmlsaXR5IGlzIGFib3V0IHlvdXIgc2Vjb25kIG1lc3NhZ2UuIE5vdCB5b3VyIGZpcnN0LiBBbnlvbmUgY2FuIHJlYWQgYSBzY3JpcHQuIFRoZSB0b3Agb25lIHBlcmNlbnQgY2hhbmdlIHRvbmUuIEJ5IG1lc3NhZ2UgdGhyZWUuIEJlY2F1c2UgdGhleSBoYXZlIGFscmVhZHkgcmVhZCB0aGUgY3VzdG9tZXIncyBlbmVyZ3kuIFNlY29uZC4gRWdvIGNsb3NlcyBub3RoaW5nLiBUaGUgcmVwcyB3aG8gZ2V0IGF0dGFjaGVkIHRvIHRoZWlyIHBpdGNoLiBMb3NlIG1vcmUgdGhhbiB0aGUgcmVwcyB3aG8gbGV0IHRoZSBwaXRjaCBicmVhdGhlLiBZb3VyIGpvYiBpcyB0byBmaXQgdGhlIGN1c3RvbWVyLiBOb3QgdG8gZGVsaXZlciBhIHBlcmZlY3QgbW9ub2xvZ3VlLiBUaGlyZC4gVGhlIG1hcmtldCBzaGlmdHMgZXZlcnkgcXVhcnRlci4gVGhlIGN1c3RvbWVyIGxhbmRzY2FwZSBzaGlmdHMgZXZlcnkgY2hhdC4gSWYgeW91ciBhcHByb2FjaCBpcyB0aGUgc2FtZSBpbiBPY3RvYmVyLiBBcyBpdCB3YXMgaW4gSnVseS4gWW91IGFyZSBhbHJlYWR5IGJlaGluZC4gUmVhZCB0aGUgcGF0dGVybnMuIEFkanVzdCB0aGUgcGxheS4=",
    "VHJhaXQgbnVtYmVyIHNpeC4gUG9zaXRpdmUgYXR0aXR1ZGUuIE1haW50YWluIGdlbnVpbmUgZW50aHVzaWFzbS4gRm9yIHdoYXQgeW91IHNlbGwuIFRyYW5zZmVyIHRoYXQgZXhjaXRlbWVudC4gVG8gdGhlIGJ1eWVyLiBTdGF5IG1vdGl2YXRlZC4gVGhyb3VnaCBkaWZmaWN1bHQgZGVhbHMuIExpZ2h0IHRoZSBGIGRvdCBVIGRvdCBTIGRvdCBFLiBGLiBGYW5hdGljYWwgYmVsaWVmLiBCZSBnZW51aW5lbHkgc29sZCBvbiB5b3VyIHNvbHV0aW9uLiBZb3VyIGVudGh1c2lhc20gaXMgY29udGFnaW91cy4gVS4gVW5kZXJ3cml0ZSB0aGUgZW5lcmd5LiBDb250cm9sIHRoZSByb29tJ3MgZW1vdGlvbmFsIGNsaW1hdGUuIEJlIHRoZSBzb3VyY2Ugb2YgdGhlIHNwYXJrLiBTLiBTcGFyayB0aGUgYnV5ZXIuIFRyYW5zZmVyIHlvdXIgZXhjaXRlbWVudC4gQW5kIGNvbnZpY3Rpb24uIFVudGlsIHRoZSBidXllciBzZWVzIHRoZSB2YWx1ZS4gRS4gRW5kdXJpbmcgZHJpdmUuIFN1c3RhaW4gbW90aXZhdGlvbi4gVGhyb3VnaG91dCBsb25nLCBjaGFsbGVuZ2luZyBkZWFscy4gVGhlIGdyaW5kIHJlcXVpcmVzIGNvbnN0YW50IGZ1ZWwuIFRocmVlIHJlYWwgdGFsayBwb2ludHMuIEZpcnN0LiBDdXN0b21lcnMgY2FuIHJlYWQgdG9uZS4gVGhyb3VnaCBjaGF0LiBUaHJvdWdoIHB1bmN0dWF0aW9uLiBUaHJvdWdoIHJlcGx5IGxhdGVuY3kuIFlvdXIgZW5lcmd5LiBUcmF2ZWxzIHRocm91Z2ggcGl4ZWxzLiBJZiB5b3UgYXJlIGZsYXQuIFRoZXkgZmVlbCBpdC4gU2Vjb25kLiBHZW51aW5lIGVudGh1c2lhc20gY2Fubm90IGJlIGZha2VkLiBCdWlsZCBhIHJlYXNvbiB0byBiZSBzb2xkLiBPbiB0aGUgcHJvZHVjdC4gVGFsayB0byBhIGN1c3RvbWVyIHdobyBsb3ZlZCB0aGUgZVNJTS4gTGlzdGVuIHRvIGEgdGhhbmsgeW91IG1lc3NhZ2UuIFJlY2hhcmdlIHRoZSBiZWxpZWYsIGJlZm9yZSB5b3VyIHNoaWZ0LiBUaGlyZC4gRW5kdXJhbmNlIGlzIHRoZSB1bmRlcnJhdGVkIHRyYWl0LiBUb3AgcGVyZm9ybWVycyBoYW5kbGUgdGhlaXIgZWlnaHRoIGNoYXQuIFdpdGggdGhlIHNhbWUgY3JhZnQuIEFzIHRoZWlyIGZpcnN0LiBCdWlsZCB0aGUgcml0dWFscyB0aGF0IHByb3RlY3QgdGhhdC4gSHlkcmF0aW9uLiBTaG9ydCBicmVha3MuIFRoZSByaWdodCBtdXNpYy4gV2hhdGV2ZXIga2VlcHMgdGhlIGZ1c2UgbGl0Lg==",
    "VHJhaXQgbnVtYmVyIHNldmVuLiBUaW1lIG1hbmFnZW1lbnQuIFByaW9yaXRpemUgaGlnaCB2YWx1ZSBhY3Rpdml0aWVzLiBUaGF0IGRyaXZlIHJldmVudWUuIFVzZSBhbGwgYXZhaWxhYmxlIHRvb2xzLiBUbyBtaW5pbWl6ZSBmcmljdGlvbi4gQW5kIGRlbGl2ZXIgcXVpY2tseS4gRGVkaWNhdGUgc3BlY2lmaWMgdGltZSBibG9ja3MuIEZvciBrbm93bGVkZ2UgZW5yaWNobWVudC4gQW5kIGZvbGxvdyB1cHMuIFVzZSBvdXIgRSBkb3QgRCBkb3QgRyBkb3QgRS4gRS4gRXh0cmFjdCB2YWx1ZS4gRm9jdXMgb25seSBvbiBoaWdoIHN0YWtlcy4gUmV2ZW51ZSBkcml2aW5nIGFjdGl2aXRpZXMuIElnbm9yZSB0aGUgbm9pc2UuIEQuIERlcGxveSBhcnNlbmFsLiBVc2UgYWxsIGF2YWlsYWJsZSB0b29scy4gQyBSIE0uIEF1dG9tYXRpb24uIEEgSS4gVG8gcmVkdWNlIGZyaWN0aW9uLiBBbmQgZGVsaXZlciBmYXN0IHNvbHV0aW9ucy4gRy4gR2VuZXJhdGUgZmxvdy4gU2NoZWR1bGUgZGFyayB0aW1lLiBGb3IgZGVkaWNhdGVkLCB1bmludGVycnVwdGVkIGtub3dsZWRnZSBlbnJpY2htZW50LiBBbmQgc2tpbGwgc2hhcnBlbmluZy4gRS4gRW5mb3JjZSBmb2xsb3cgdXAuIE1haW50YWluIGEgZGlzY2lwbGluZWQgc2NoZWR1bGUuIFRvIGVuc3VyZSBubyBsZWFkIGdvZXMgY29sZC4gQW5kIGV2ZXJ5IGRldGFpbCBpcyBleGFtaW5lZC4gVGhyZWUgYWRkaXRpb25hbCBzaGFycCBwb2ludHMuIEZpcnN0LiBZb3VyIHRpbWUgaXMgZmluaXRlLiBUaGUgY3VzdG9tZXIncyBjdXJpb3NpdHkuIElzIGV2ZW4gc2hvcnRlci4gVGhlIGZpcnN0IHNpeHR5IHNlY29uZHMgb2YgYW55IGNoYXQuIERlY2lkZSB3aGV0aGVyIHlvdSBoYXZlIG1vbWVudHVtLiBPciB3aGV0aGVyIHlvdSBhcmUgcmVjb3ZlcmluZyBmcm9tIGEgc2xvdyBzdGFydC4gT3BlbiBzdHJvbmcuIFNlY29uZC4gVGhlIGRhcmsgdGltZSBjb25jZXB0LiBDb21lcyBmcm9tIHRoZSBuYXZ5IHNlYWwgY29tbXVuaXR5LiBPbmUgaG91ciBvZiB1bmludGVycnVwdGVkIGZvY3VzLiBCZWF0cyBmb3VyIGhvdXJzIG9mIGZyYWN0dXJlZCBhdHRlbnRpb24uIEJsb2NrIGl0IG9uIHlvdXIgY2FsZW5kYXIuIERlZmVuZCBpdCBsaWtlIGEgY2hhdCBxdWV1ZSBhdCBwZWFrLiBUaGlyZC4gRm9sbG93IHVwIGlzIHRoZSBtb3N0IGlnbm9yZWQsIGhpZ2hlc3QgbGV2ZXJhZ2UgYWN0aXZpdHkgaW4gY2hhdCBzdXBwb3J0LiBSb3VnaGx5IGZvcnR5IHBlcmNlbnQgb2YgY3VzdG9tZXJzLCByZXR1cm4gdG8gYSBjaGF0IHRocmVhZCwgaWYgeW91IHJlLWVuZ2FnZSB3aXRoIG9uZSB0aG91Z2h0ZnVsIG1lc3NhZ2UuIFRoYXQgaXMgZnJlZSByZXZlbnVlLiBTaXR0aW5nIGluIHlvdXIgaW5ib3gu",
    "U3RlcCBiYWNrLiBMb29rIGF0IHRoZSBzaGFwZSBvZiBpdC4gVGhpcy4gSXMgdGhlIEQgTiBBLiBPZiBhIHRvcCBwZXJmb3JtZXIuIFNldmVuIHRyYWl0cy4gUHVsbGluZyBvbiBhIGNlbnRyYWwgY29tbWl0bWVudC4gV2UgZG8gd2hhdGV2ZXIgaXQgdGFrZXMuIFRvIGdldCBhIG9uZSBodW5kcmVkIHBlcmNlbnQuIEhpdCBvdXQuIE9uIHN1Y2Nlc3MuIENvbW11bmljYXRpb24uIFBlcnNpc3RlbmNlLiBFbXBhdGh5LiBQcm9kdWN0IGtub3dsZWRnZS4gQWRhcHRhYmlsaXR5LiBQb3NpdGl2ZSBhdHRpdHVkZS4gVGltZSBtYW5hZ2VtZW50LiBUaHJlZSBzaGFycGVyIG9ic2VydmF0aW9ucy4gRmlyc3QuIFlvdSB3aWxsIG5vdCBiZSB3b3JsZCBjbGFzcy4gSW4gYWxsIHNldmVuLiBUb2RheS4gVGhhdCBpcyBmaW5lLiBUb3AgcGVyZm9ybWVycyBpZGVudGlmeSB0aGVpciB0d28gd2Vha2VzdC4gQW5kIHNwZW5kIHRoZSBuZXh0IHF1YXJ0ZXIuIFNoYXJwZW5pbmcgdGhlbS4gU3BlY2lmaWNhbGx5LiBOb3QgZ2VuZXJhbGx5LiBTZWNvbmQuIFRoZSB3ZWRnZSBhdCB0aGUgdG9wIG9mIHRoZSBkaWFncmFtLiBJcyB0aGUgb25lIHlvdSBhcmUgYmVzdCBhdC4gVGhhdCBpcyB5b3VyIGFuY2hvci4gTGVhZCB3aXRoIGl0LiBXaGlsZSB0aGUgb3RoZXJzIGNhdGNoIHVwLiBUaGlyZC4gUGljayB5b3Vycywgbm93LCBpbiB5b3VyIGhlYWQuIFRoZSB0d28geW91IGFyZSB3ZWFrZXN0IGF0LiBBbmQgdGhlIG9uZS4gWW91IGFyZSBxdWlldGx5IHByb3VkIG9mLiBIb2xkIHRoZW0uIFdlIGFyZSBhYm91dCB0byBwdXQgdGhlbS4gVGhyb3VnaCBhIGRyaWxsLg==",
    "UXVpY2sgZHJpbGwuIFRvIGxvY2sgdGhlIGZyYW1ld29ya3MgaW4uIE9uIHlvdXIgc2NyZWVuLiBGb3VyIGZyYW1ld29ya3MuIEMgZG90IEwgZG90IEUgZG90IEEgZG90IFIuIFMgZG90IEggZG90IEEgZG90IFQgZG90IFQgZG90IEUgZG90IFIuIFMgZG90IEwgZG90IE8gZG90IFQuIEFuZCBBIGRvdCBDIGRvdCBFLiBGb3VyIHRyYWl0cy4gQ29tbXVuaWNhdGlvbi4gUGVyc2lzdGVuY2UuIEVtcGF0aHkuIFByb2R1Y3Qga25vd2xlZGdlLiBUYXAgYSBmcmFtZXdvcmsuIFRoZW4gdGFwIHRoZSB0cmFpdCBpdCBzZXJ2ZXMuIE1hdGNoIGFsbCBmb3VyLiBUbyBjb21wbGV0ZSB0aGUgZHJpbGwuIE5vIHRpbWUgcHJlc3N1cmUuIFBhdXNlIHRoZSBuYXJyYXRpb24uIE9uIHRoZSByaWdodC4gSWYgeW91IG5lZWQgbW9yZSB0aW1lLiBXcm9uZyBtYXRjaGVzIHdpbGwgZ2VudGx5IHNoYWtlLiBKdXN0IHRyeSBhIGRpZmZlcmVudCBwYWlyaW5nLiBHZXQgYWxsIGZvdXIuIEFuZCBhIHByb2NlZWQgYnV0dG9uLiBXaWxsIGFwcGVhci4gRm9yIHRoZSBuZXh0IHNsaWRlLiBUaGlzIGlzIHRoZSBraW5kIG9mIHBhdHRlcm4gcmVjb2duaXRpb24uIFlvdSBidWlsZCBpbiB0aGUgZmlyc3QgdGhyZWUgbW9udGhzLiBPbiB0aGUgZmxvb3IuIFRha2UgeW91ciBtb21lbnQu",
    "Tm93LiBUaGUgc2VjcmV0IHdlYXBvbi4gVGhlIG9uZSBpbiB5b3VyIGFyc2VuYWwuIFRoYXQgc2l0cyBhYm92ZS4gQWxsIHNldmVuIHRyYWl0cy4gQmVjb21lLiBUaGUgZWR1Y2F0b3IuIE5vdCB0aGUgdmVuZG9yLiBOb3QgdGhlIGNsb3Nlci4gVGhlIGVkdWNhdG9yLiBUaHJlZSBwb2ludHMgdG8gYWJzb3JiLiBGaXJzdC4gU29sdmUgdGhlIHByb2JsZW1zLiBPZiB5b3VyIHBhc3Qgc2VsZi4gVGhlIHZlcnNpb24gb2YgeW91LiBXaG8gZ290IGNvbmZ1c2VkIGJ5IGFjdGl2YXRpb24uIFRoZSB2ZXJzaW9uIHdobyBkaWQgbm90IGtub3cgd2hhdCBhbiBlU0lNIHdhcy4gVGhlIHZlcnNpb24uIFdobyBmZWFyZWQgcm9hbWluZyBiaWxscy4gU3BlYWsgdG8gdGhhdCBwYXN0IHZlcnNpb24uIEluIGV2ZXJ5IGNoYXQuIEVkdWNhdGUgdGhlIGN1c3RvbWVyLiBQYXN0IHRoZSBmcmljdGlvbi4gVGhleSBkaWQgbm90IGV2ZW4ga25vdy4gRXhpc3RlZC4gU2Vjb25kLiBFYXJuIGF1dGhvcml0eS4gQnkgc3RheWluZyBvbmUgc3RlcCBhaGVhZC4gT2YgdGhlIGN1c3RvbWVyJ3Mgam91cm5leS4gUmVhZCB1cCBvbiBuZXcgZGVzdGluYXRpb25zLiBOZXcgcGhvbmUgbW9kZWxzLiBOZXcgQSBJIGJlaGF2aW91cnMuIEJlIHRoZSBhZ2VudC4gV2hvIGFscmVhZHkga25ldy4gV2hhdCB0aGUgY3VzdG9tZXIganVzdCBmb3VuZCBvdXQuIFRoaXJkLiBFZHVjYXRvcnMgZ2V0IHJlZmVycmFscy4gQ2xvc2VycyBkbyBub3QuIEEgY3VzdG9tZXIgd2hvIGlzIHRhdWdodCBzb21ldGhpbmcgdXNlZnVsLiBUZWxscyB0aGVpciBmcmllbmRzLiBBIGN1c3RvbWVyIHdobyBpcyBjbG9zZWQuIEp1c3QgbGVhdmVzIGEgcmV2aWV3LiBDaG9vc2Ugd2hpY2ggb25lLiBZb3Ugd2FudCB0byBiZS4gVGhhdC4gSXMgdGhlIHNlY3JldCB3ZWFwb24uIEl0IHNjYWxlcyBhY3Jvc3MgZXZlcnkgY2hhdC4gRXZlcnkgc2hpZnQuIEV2ZXJ5IGxheWVyIG9mIG91ciB0ZWFtLg==",
    "U2FsZXMgYXNzYXNzaW5zLiBIYXZlIHRoZSB1dG1vc3QgaW50ZWdyaXR5LiBBIG1hbidzIGFtYml0aW9uLiBTaG91bGQgbmV2ZXIgZXhjZWVkLiBIaXMgd29ydGguIFdlIHdvdWxkIGRvIHdlbGwuIFRvIHJlbWVtYmVyIHRoYXQuIFRoYXQgbGluZS4gSXMgZnJvbSBKb2huIFdpY2suIENoYXB0ZXIgRm91ci4gU3Bva2VuLiBCeSB0aGUgSGFyYmluZ2VyLiBUaHJlZSBwb2ludHMgb24gd2h5IHRoaXMgbWF0dGVycy4gVG8gYSBwcmVzYWxlcyBmbG9vci4gRmlyc3QuIEludGVncml0eS4gSXMgdGhlIG9ubHkgY3VycmVuY3kuIFRoYXQgY29tcG91bmRzIG92ZXIgeWVhcnMuIE1hbnVmYWN0dXJlZCB1cmdlbmN5LiBGYWtlIHNjYXJjaXR5LiBQcmVzc3VyZSB0YWN0aWNzLiBUaGVzZSBnZXQgeW91IGEgc2luZ2xlIGNoYXQgd2luLiBBbmQgY29zdCB5b3UuIEEgcmVwdXRhdGlvbi4gU2Vjb25kLiBFdmVyeSBtb3ZlIHdlIG1hZGUgaW4gdGhlIGZpcnN0IG1vZHVsZS4gRXZlcnkgbW92ZSB3ZSBtYWtlIHRvZGF5LiBXaWxsIG9ubHkgd29yay4gSWYgdGhlIGN1c3RvbWVyIHRydXN0cy4gVGhhdCB5b3UgYXJlIG5vdCBwbGF5aW5nIHRoZW0uIFRydXN0IGlzIHRoZSByYXRlIGxpbWl0ZXIuIE9uIGV2ZXJ5dGhpbmcuIFRoaXJkLiBXb3J0aCBjb21lcyBmaXJzdC4gQW1iaXRpb24gZm9sbG93cy4gQnVpbGQgdGhlIHNraWxsLiBFYXJuIHRoZSBhbGlhcy4gVGhlbiBjaGFzZSB0aGUgbnVtYmVyLiBJbiB0aGF0IG9yZGVyLiBUaGUgcmVwcyB3aG8gZmxpcCB0aGF0IHNlcXVlbmNlLiBOZXZlciBtYWtlIGl0IHRvIHllYXIgdGhyZWUuIEJlIHNoYXJwLiBCZSByZWxlbnRsZXNzLiBCdXQgYmUgZWFybmVkLg==",
    "Tm93LiBXZSB0dXJuIHRvIHlvdS4gT24geW91ciBzY3JlZW4uIFRocmVlIHNob3J0IGxpbmVzLiBZb3VyIGFzc2Fzc2luIGFsaWFzLiBGcm9tIHRoZSBhc3Nlc3NtZW50LiBPbmUgc3RyZW5ndGggdGhlIHJlc3VsdCBjYXB0dXJlZCBhYm91dCB5b3UuIEFuZCBvbmUgdHJhaXQgeW91IHdpbGwgc2hhcnBlbi4gVGhpcyBxdWFydGVyLiBUeXBlIGVhY2ggb25lIGluLiBXaGVuIHlvdSBhcmUgaGFwcHkuIENsaWNrIFNhdmUuIE9uZSBieSBvbmUsIHdlIHdpbGwgZ28gYXJvdW5kIHRoZSByb29tLiBBbmQgc2hhcmUuIFNvIHdlIGNhbiBnZXQgdG8ga25vdyBlYWNoIG90aGVyLiBCZXR0ZXIuIFBhdXNlIHRoZSBuYXJyYXRpb24uIE9uIHRoZSByaWdodCBzaWRlLiBJZiB5b3UgbmVlZCBtb3JlIHRpbWUuIFRvIHRoaW5rLiBUaHJlZSB0aGluZ3MgdG8ga2VlcCBpbiBtaW5kLiBBcyB5b3Ugd3JpdGUuIEZpcnN0LiBUaGVyZSBpcyBubyB3cm9uZyBhbGlhcy4gT25seSB0aGUgb25lIHlvdSBjb21taXQgdG8gZ3Jvd2luZyBpbnRvLiBQaWNrIHRoZSBhbGlhcyB0aGF0IGZlZWxzIGxpa2UgYSBzdHJldGNoLiBOb3QgdGhlIHNhZmUgb25lLiBTZWNvbmQuIFRoZSBzdHJlbmd0aCB5b3Ugd3JpdGUuIElzIHRoZSBvbmUgeW91ciBwZWVycyB3aWxsIGhlYXIgZmlyc3QuIENob29zZSB0aGUgb25lLiBZb3Ugd2FudCB0byBiZSBrbm93biBmb3IuIFRoaXJkLiBUaGUgdHJhaXQgeW91IHNoYXJwZW4uIFdpbGwgYmUgdGhlIG9uZSB5b3VyIHNoaWZ0IG1hbmFnZXIuIENvYWNoZXMgeW91IG9uLiBQaWNrIHRoZSBvbmUgdGhhdCBzY2FyZXMgeW91IGEgbGl0dGxlLiBUaGF0IGlzIHdoZXJlIHRoZSBncm93dGggbGl2ZXMuIFRha2UgeW91ciBtb21lbnQuIFRoZW4gc2hhcmUuIFRoZSB0ZWFtIGlzIGxpc3RlbmluZy4=",
    "VG8gY2xvc2UuIFdhYmkgc2FiaS4gQSBKYXBhbmVzZSBwaGlsb3NvcGh5LiBJbnZvbHZlcyByZXN0b3JpbmcgYnJva2VuIG9iamVjdHMuIEFuZCBlbmhhbmNpbmcgdGhlaXIgdmFsdWUuIEJ5IGVtYnJhY2luZy4gVGhlIGluaGVyZW50IGJlYXV0eS4gT2YgaW1wZXJmZWN0aW9uLiBQaWVjZXMgb2YgdGhlIHNoYXR0ZXJlZCBzZWxmLiBBcmUgYWx3YXlzIHRoZXJlLiBXaGV0aGVyIHB1dCBiYWNrIHRvZ2V0aGVyLiBCeSBnb2xkLiBPciBieSBtdWQuIFdlIGxlYXJuIHRvIGxpdmUuIFdpdGggdGhlIGltcGVyZmVjdGlvbnMuIEFuZCBhcHByZWNpYXRlIHRoZW0uIFRocmVlIGNsb3NpbmcgdGhvdWdodHMuIEZpcnN0LiBUaGUgZ29hbCBpcyBub3QgcGVyZmVjdGlvbi4gSXQgaXMgaW1wcm92ZW1lbnQuIFNoYXJwIHdoZXJlIGl0IG1hdHRlcnMuIEZvcmdpdmluZyB3aXRoIHlvdXJzZWxmLiBXaGVyZSB0aGUgc2hhdHRlciBpcyBzdGlsbCBoZWFsaW5nLiBTZWNvbmQuIFRoZSBhbGlhc2VzIHlvdSBjYXJyeSBvdXQgb2YgdGhpcyByb29tLiBBcmUgd29ya2luZyB0b29scy4gTm90IGxhYmVscy4gVGhleSBncm93IHdpdGggeW91LiBVcGRhdGUgdGhlbS4gQXMgeW91IGdyb3cuIFRoaXJkLiBBbnkgcXVlc3Rpb24gaXMgYSBnb29kIHF1ZXN0aW9uLiBUaGUgaGFyZCBvbmVzIGFyZSB0aGUgYmVzdCBvbmVzLiBUYWtlIHRoZSBmbG9vci4gUHVzaCBiYWNrLiBNaW5kc2V0IHRyYWluaW5nLiBJcyBhIGRpYWxvZ3VlLiBOb3QgYSBkb3dubG9hZC4gVGhhbmsgeW91LiBUZWFtLiBGcm9tIG1lLiBUbyB5b3Uu",
    "T25lIGxhc3QgdGhpbmcuIEJlZm9yZSB5b3UgZ28uIFNpZ24geW91ciBjb2RlLiBUaHJlZSBsaW5lcy4gT24geW91ciBzY3JlZW4uIE9uZS4gVGhlIHRyYWl0IHlvdSB3aWxsIHNoYXJwZW4gdGhpcyB3ZWVrLiBUd28uIFRoZSBmcmFtZXdvcmsgeW91IHdpbGwgZGVwbG95LiBPbiB5b3VyIHZlcnkgbmV4dCBjaGF0LiBUaHJlZS4gWW91ciBhc3Nhc3NpbiBhbGlhcy4gVGhlIG5hbWUuIFlvdSBhcmUgZ2l2aW5nLiBUaGlzIHNoYXJwZXIgdmVyc2lvbi4gT2YgeW91LiBUeXBlIHRoZW0gaW4uIENsaWNrLiBTaWduIG15IGNvZGUuIFlvdSBjYW4gcHJpbnQgaXQuIFRhcGUgaXQgbmV4dCB0byB5b3VyIG1vbml0b3IuIE9yIGZvbGQgaXQuIEFuZCBwdXQgaXQgaW4geW91ciB3YWxsZXQuIFRocmVlIHJlYXNvbnMgdGhpcyBtYXR0ZXJzLiBGaXJzdC4gV3JpdGluZyBpdCBkb3duLiBUcmlwbGVzIHRoZSBjaGFuY2UgeW91IGRvIGl0LiBTdGFuZm9yZCByZXNlYXJjaC4gTm90IG9waW5pb24uIFBlbiBiZWF0cyBtZW1vcnkuIFNlY29uZC4gVGhlIHRyYWl0IHlvdSBwaWNrLiBTZXRzIHlvdXIgY29hY2hpbmcgZm9jdXMuIEZvciB0aGUgcXVhcnRlci4gWW91ciBzaGlmdCBtYW5hZ2VyIHdpbGwgc2VlIGl0LiBJbiB5b3VyIHRyYW5zY3JpcHQgcmV2aWV3cy4gVGhpcmQuIFRoZSBhbGlhcyBpcyBpZGVudGl0eS4gVGhlIGZyYW1ld29yayBpcyBhY3Rpb24uIFRoZSB0cmFpdCBpcyBkaXJlY3Rpb24uIFRocmVlIGxpbmVzLiBUaGF0IGlzIGFsbCB0aGUgYXJjaGl0ZWN0dXJlIHlvdSBuZWVkLiBUaGUgdGhyZXNob2xkLiBJcyB5b3Vycy4gVGhlIGFyc2VuYWwuIElzIHlvdXJzLiBUaGUgd2Vlay4gSXMgeW91cnMuIE5vdyBnby4gU2hhdHRlci4="
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
    voiceLabel: 'American English (female)',
  };

  function pickLockedVoice(voices) {
    // Prefer Google's US English (Chrome's stock en-US voice).
    let v = voices.find(v => v.name === 'Google US English');
    if (v) return v;
    // Microsoft / Edge premium natural female voices.
    v = voices.find(v => /^en[-_]US/i.test(v.lang) && /(aria|jenny|ava|nova|sara|emma)/i.test(v.name));
    if (v) return v;
    // Apple / macOS US English female voices (Samantha is the modern Siri default).
    v = voices.find(v => /^en[-_]US/i.test(v.lang) && /\b(samantha|allison|susan|victoria|karen|kathy|veena|flo|shelley|sandy)\b/i.test(v.name));
    if (v) return v;
    // Any explicitly-female en-US voice.
    v = voices.find(v => /^en[-_]US/i.test(v.lang) && /female/i.test(v.name));
    if (v) return v;
    // Any en-US voice.
    v = voices.find(v => /^en[-_]US/i.test(v.lang));
    if (v) return v;
    // Last resort: any English.
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
    const exactMatch = state.voice && /(google us english|samantha|aria|jenny|ava)/i.test(state.voice.name);

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
      console.info('[narration-assassin] No US-female premium voice found; using fallback:', resolvedName, resolvedLang);
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
